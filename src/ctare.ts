#!/usr/bin/env node
// tslint:disable: no-console
import childProcess from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';
import rimraf from 'rimraf';
import commandExists from 'command-exists';
import path from 'path';

import { fixedDeps, fixedDevDeps, features } from './constants';
import { Dict, BooleanDict } from './interfaces';

// global variables
const files = [
  'src/App.vue',
  'src/global.sass',
  'src/main.js',
  'vue.config.js',
];
const selection: Dict<BooleanDict> = {};
let projectTemplateFolder = path.normalize(path.join(__dirname, '../project'));
let projectName = '';
let vueVersion;

(async () => {
  getProjectName();
  await commandExists('vue');
  await checkVueCliVersion();
  await runVueCli();
  await changeDirToProject();
  getProjectSetting();
  await getCtareConfig();
  removeNotNeedFile();
  copyFiles();
  await installModules();
  await editBrowsersList();
  handleDistIgnore();
  await handleStorybook();
  handleTags();
  addCommit();
})();

function getProjectName() {
  projectName = process.argv[2];
  if (!projectName) {
    throw new Error(
      'Error: No project name is given\nUsage: ./ctare.js <project-name>'
    );
  }
}

function checkVueCliVersion() {
  return new Promise((resolve, reject) => {
    childProcess.exec('vue -V', (err, stdout, stderr) => {
      const mainVersionNum = +stdout
        .toString()
        .replace('@vue/cli ', '')
        .split('.')[0];
      mainVersionNum >= 4
        ? resolve()
        : reject(
            new Error(
              'Error: The version of installed Vue-cli < 4.0.0\nRun "yarn global install @vue/cli" or "npm install --global @vue/cli" to install the latest vue-cli.'
            )
          );
    });
  });
}

async function runVueCli() {
  return promiseSpawn('vue', ['create', projectName]).catch((code) => {
    throw new Error('Vue-cli process exited with error code ' + code);
  });
}

function getProjectSetting() {
  const pkg = JSON.parse(
    fs.readFileSync('./package.json', { encoding: 'utf-8' })
  );
  vueVersion = pkg.dependencies.vue.match(/^\^?(\d+)/)[1];
  if (vueVersion === '2') {
    projectTemplateFolder = path.join(projectTemplateFolder, 'vue2');
  } else if (vueVersion === '3') {
    projectTemplateFolder = path.join(projectTemplateFolder, 'vue3');
  } else {
    throw Error('Unsupported Vue Version');
  }
  selection.internal = {
    router: fs.existsSync('./src/router/index.js'),
    store: fs.existsSync('./src/store/index.js'),
  };
  if (selection.internal.store) {
    files.push('src/store/index.js');
  }
}

async function getCtareConfig() {
  console.clear();
  const selectableFunctions = features.function.filter((f) => {
    if (f.dependOn) {
      return f.dependOn.every((d) => selection.internal[d]);
    }
    return true;
  });
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Check the fonts needed for your project: ',
        name: 'font',
        choices: features.font,
      },
      {
        type: 'checkbox',
        message: 'Check the functions needed for your project: ',
        name: 'function',
        when: selectableFunctions.length > 0,
        choices: selectableFunctions,
      },
      {
        type: 'checkbox',
        message: `Check the modules needed for your project (${fixedDeps.join(
          ', '
        )} will be installed): `,
        name: 'module',
        choices: features.module,
      },
      {
        type: 'checkbox',
        message: 'Check the plugins needed for your project: ',
        name: 'plugin',
        choices: features.plugin,
      },
    ])
    .then((answers) => {
      // parse selected features
      Object.entries(answers).forEach(([category, categoryAnswers]) => {
        const categorySelection: { [key: string]: boolean } = {};
        categoryAnswers.forEach((c: string) => {
          categorySelection[c] = true;
        });
        selection[category] = categorySelection;
      });
    });
}

async function changeDirToProject() {
  return Promise.resolve(process.chdir(projectName));
}

function removeNotNeedFile() {
  if (fs.existsSync('src/components/HelloWorld.vue'))
    fs.unlinkSync('src/components/HelloWorld.vue');
  if (fs.existsSync('src/assets/logo.png'))
    fs.unlinkSync('src/assets/logo.png');
  rimraf.sync('src/views/');
}

function copyFiles() {
  const hasRouter = selection.internal.router;
  const hasStore = selection.internal.store;
  childProcess.execSync(`cp ${projectTemplateFolder}/vue.config.js .`);
  childProcess.execSync(`cp -rf ${projectTemplateFolder}/src .`);
  childProcess.execSync(
    `cp -rf ${projectTemplateFolder}/public/index.html ./public/`
  );
  if (!hasRouter) {
    rimraf.sync('src/router/');
    rimraf.sync('src/views/');
  }
  if (!hasStore) {
    rimraf.sync('src/store/');
  }
  if (selection.plugin.storybook) {
    childProcess.execSync(`cp -rf ${projectTemplateFolder}/storybook .`);
    files.push('storybook/config.js');
  } else {
    fs.unlinkSync('src/storybook.sass');
  }
  if (!selection.plugin.storybook || !hasStore) {
    fs.unlinkSync('src/StoreMock.js');
  }
  childProcess.execSync('\\rm -rf ctare-cli/');
}

function installDeps(program: 'yarn' | 'npm') {
  return (args: string[], deps: string[]) => {
    return async () => {
      if (deps.length > 0) {
        return promiseSpawn(program, [...args, ...deps]).catch((code) => {
          throw new Error(
            'Dependencies install process exited with code ' + code
          );
        });
      } else {
        return Promise.resolve();
      }
    };
  };
}

async function installModules() {
  // determine package manager to use
  const hasYarn = fs.existsSync('yarn.lock');
  const installDepsProgram = hasYarn ? 'yarn' : 'npm';
  const installDepsArgs = hasYarn ? ['add'] : ['install', '--save'];
  const installDevDepsArgs = hasYarn ? ['add', '-D'] : ['install', '-D'];
  const install = installDeps(installDepsProgram);

  // collect modules that need to installed
  let deps = fixedDeps;
  let devDeps = fixedDevDeps;
  Object.entries(features).forEach(([category, categoryFeatures]) => {
    categoryFeatures.forEach((feature) => {
      if (selection[category][feature.name]) {
        if (feature.packages) deps = deps.concat(feature.packages);
        if (feature.devPackages) devDeps = devDeps.concat(feature.devPackages);
      }
    });
  });
  return install(installDepsArgs, deps)().then(
    install(installDevDepsArgs, devDeps)
  );
}

async function editBrowsersList() {
  const browserslist = ['> 1% in tw', 'last 3 versions', 'not ie <= 11'];
  return new Promise((resolve, reject) => {
    fs.writeFile('.browserslistrc', browserslist.join('\n'), (err) =>
      !err ? resolve() : reject(err)
    );
  });
}

function handleDistIgnore() {
  if (selection.function['add-dist-to-git-repo']) {
    fs.appendFileSync('.gitignore', '\n# add by ctare\n!/dist');
  }
}

async function handleStorybook() {
  if (selection.plugin.storybook) {
    return promiseSpawn('vue', ['add storybook'])
      .then(() => {
        childProcess.execSync('\\rm -rf config/');
        const pkg = JSON.parse(
          fs.readFileSync('./package.json', { encoding: 'utf-8' })
        );
        pkg.scripts['storybook:serve'] = pkg.scripts['storybook:serve'].replace(
          'config/storybook',
          'storybook'
        );
        pkg.scripts['storybook:build'] = pkg.scripts['storybook:build'].replace(
          'config/storybook',
          'storybook'
        );
        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
        let content = fs.readFileSync('./src/stories/index.stories.js', {
          encoding: 'utf-8',
        });
        content = content
          .replace('../components/MyButton.vue', '@/components/MyButton.vue')
          .replace(
            '/* eslint-disable import/no-extraneous-dependencies */\n',
            ''
          );
        fs.writeFileSync('./src/stories/index.stories.js', content);
      })
      .catch((code) => {
        throw new Error('storybook process exited with error code ' + code);
      });
  }
}

function handleTags() {
  function tag2var(tag: string) {
    return tag.replace(/-/g, '_').replace(/\./g, '_').replace(/@/g, '$');
  }
  function expressionTransform(expression: string) {
    return expression.replace(/&/g, '&&').replace(/\|/g, '||');
  }
  // collect all feature tags
  const tags: BooleanDict = {};
  Object.keys(features).forEach((category) => {
    features[category].forEach((f) => {
      tags[`${f.name}@${category}`] = !!selection[category][f.name];
    });
  });
  Object.keys(selection.internal).forEach((s) => {
    tags[`${s}@internal`] = selection.internal[s];
  });

  // form a javascript code with the tags
  const vars = Object.keys(tags)
    .map((t) => `const ${tag2var(t)} = ${tags[t]};`)
    .join('');

  // collect all expressions from files
  const expressions: BooleanDict = {};
  files.forEach((filename) => {
    const content = fs.readFileSync(filename, { encoding: 'utf-8' });
    if (content) {
      (content.match(/(?<=\[\[|\<\<)[a-z\-.@&|!]+/g) || []).forEach(
        (expression) => {
          expressions[expression] = true;
        }
      );
    }
  });
  const expressionList = Object.keys(expressions);

  // form a javascript code from the expressions
  const statement = `[${expressionList
    .map((e) => expressionTransform(tag2var(e)))
    .join(',')}]`;
  // tslint:disable-next-line: no-eval
  const results = eval(vars + statement);
  expressionList.map((e, i) => {
    expressions[e] = results[i];
  });

  // remove unneed part from file
  files.forEach((filePath) => {
    const lines = fs.readFileSync(filePath, { encoding: 'utf-8' }).split('\n');
    const newLines: string[] = [];
    let blockTag: null | string = null;
    let previousBomb = false;
    lines.forEach((line) => {
      const expressionMatch = line.match(/(\[\[|\<\<)([a-z\-.@&|!]+)/);
      const endMatch = line.match(/\<\<\/([a-z\-.@&|!]+)/);
      const bombAMatch = line.match(/(\[\[\]\])/);
      const bombBMatch = line.match(/(\[\[\/\]\])/);
      if (previousBomb && bombBMatch) {
        newLines.pop();
        previousBomb = false;
      } else if (endMatch) {
        if (endMatch[1] === blockTag) blockTag = null;
      } else if (blockTag) return;
      else if (expressionMatch) {
        if (expressionMatch[1] === '<<' && !expressions[expressionMatch[2]])
          blockTag = expressionMatch[2];
        if (expressionMatch[1] === '[[' && expressions[expressionMatch[2]]) {
          previousBomb = !!bombAMatch;
          newLines.push(line);
        }
      } else {
        previousBomb = !!bombAMatch;
        newLines.push(line);
      }
    });
    const newContent = newLines
      .join('\n')
      .replace(/ ?\/\/\[\[.*$/gm, '')
      .replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(filePath, newContent);
  });
}

function addCommit() {
  childProcess.execSync('git add .');
  childProcess.execSync('git commit -m "setup"');
}

async function promiseSpawn(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    childProcess
      .spawn(command, args, { shell: true, stdio: 'inherit' })
      .on('close', (code) => (code === 0 ? resolve() : reject()));
  });
}
