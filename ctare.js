#!/usr/bin/env node

const child_process = require('child_process');
const commandExists = require('command-exists');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const rimraf = require('rimraf');

const features = require('./lib/features');
const fixedDevDeps = require('./lib/dev-deps');

// global variables
const files = [
  'src/App.vue',
  'src/global.sass',
  'src/main.js',
  'vue.config.js'
];
const selection = {};
let projectName = '';

getProjectName()
  .then(() => commandExists('vue'))
  .then(checkVueCliVersion)
  .then(runVueCli)
  .then(changeDirToProject)
  .then(getProjectSetting)
  .then(getCtareConfig)
  .then(removeUnneedFile)
  .then(cloneCtareSource)
  .then(handleFavicon)
  .then(copyFiles)
  .then(installModules)
  .then(editBrowsersList)
  .then(handleDistIgnore)
  .then(handleStorybook)
  .then(handleTags)
  .then(addCommit)
  .catch(console.error);

function getProjectName() {
  return new Promise((resolve, reject) => {
    projectName = process.argv[2];
    projectName
      ? resolve(projectName)
      : reject(
          new Error(
            'Error: No project name is given\nUsage: ./ctare.js <project-name>'
          )
        );
  });
}

function checkVueCliVersion() {
  return new Promise((resolve, reject) => {
    child_process.exec('vue -V', (err, stdout, stderr) => {
      const mainVersionNum = +stdout.toString().replace('@vue/cli ', '').split('.')[0];
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

function runVueCli() {
  return promiseSpawn('vue', ['create', projectName]).catch(code => {
    throw new Error('Vue-cli process exited with error code ' + code);
  });
}

function getProjectSetting() {
  selection.internal = {
    router: fs.existsSync('./src/router/index.js'),
    store: fs.existsSync('./src/store/index.js')
  };
  if(selection.internal.store) {
    files.push('src/store/index.js')
  }
}

function getCtareConfig() {
  process.stdout.write('\033c\033[3J'); // clear screen
  const selectableFunctions = features.function.filter(f => {
    if (f.depend_on) {
      return f.depend_on.every(d => selection.internal[d]);
    }
    return true;
  });
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Check the fonts needed for your project: ',
        name: 'font',
        choices: features.font
      },
      {
        type: 'checkbox',
        message: 'Check the functions needed for your project: ',
        name: 'function',
        when: selectableFunctions.length > 0,
        choices: selectableFunctions
      },
      {
        type: 'checkbox',
        message: 'Check the modules needed for your project: ',
        name: 'module',
        choices: features.module
      },
      {
        type: 'checkbox',
        message: 'Check the plugins needed for your project: ',
        name: 'plugin',
        choices: features.plugin
      },
      {
        type: 'checkbox',
        message: 'Check the other functions needed for your project: ',
        name: 'other',
        choices: features.other
      }
    ])
    .then(answers => {
      // parse selected features
      Object.keys(answers).forEach(category => {
        const categorySelection = {};
        answers[category].forEach(c => {
          categorySelection[c] = true;
        });
        selection[category] = categorySelection;
      });
    });
}

function changeDirToProject() {
  return Promise.resolve(process.chdir(projectName));
}

function removeUnneedFile() {
  if (fs.existsSync('src/components/HelloWorld.vue')) fs.unlinkSync('src/components/HelloWorld.vue');
  if (fs.existsSync('src/assets/logo.png')) fs.unlinkSync('src/assets/logo.png');
  rimraf.sync('src/views/');
}

function cloneCtareSource() {
  return promiseSpawn('git', [
    'clone',
    '--depth',
    '1',
    'https://github.com/andy23512/ctare-cli/'
  ]).catch(code => {
    throw new Error('Clone CTARE github repo exited with error code' + code);
  });
}

function copyFiles() {
  const hasRouter = selection.internal.router;
  const hasStore = selection.internal.store;
  child_process.execSync('cp ctare-cli/vue.config.js .');
  child_process.execSync('cp -rf ctare-cli/src .');
  child_process.execSync('cp -rf ctare-cli/public/index.html ./public/');
  if (!hasRouter) {
    rimraf.sync('src/router/');
    rimraf.sync('src/views/');
  }
  if (!hasStore) {
    rimraf.sync('src/store/');
  }
  if (selection.plugin['storybook']) {
    child_process.execSync('cp -rf ctare-cli/storybook .');
    files.push('storybook/config.js')
  }
  else {
    fs.unlinkSync('src/storybook.sass')
  }
  if (!selection.plugin['storybook'] || !hasStore) {
    fs.unlinkSync('src/StoreMock.js')
  }
  child_process.execSync('\\rm -rf ctare-cli/');
}

function handleFavicon() {
  if (selection.other['tech-orange-favicon']) {
    child_process.execSync('cp -rf ctare-cli/public/favicon.ico ./public/');
  }
}

function installDeps(program) {
  return (args, deps) => {
    return () => {
      if (deps.length > 0) {
        return promiseSpawn(program, [...args, ...deps]).catch(code => {
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

function installModules() {
  // determine package manager to use
  const hasYarn = fs.existsSync('yarn.lock');
  const installDepsProgram = hasYarn ? 'yarn' : 'npm';
  const installDepsArgs = hasYarn ? ['add'] : ['install', '--save'];
  const installDevDepsArgs = hasYarn ? ['add', '-D'] : ['install', '-D'];
  const install = installDeps(installDepsProgram);

  // collect modules that need to installed
  let deps = ['ramda', 'jquery'];
  let devDeps = fixedDevDeps;
  Object.keys(features).forEach(category => {
    features[category].forEach(feature => {
      if (selection[category][feature.name]) {
        if (feature.packages) deps = deps.concat(feature.packages);
        if (feature.devPackages) devDeps = devDeps.concat(feature.devPackages);
      }
    })
  });
  return install(installDepsArgs, deps)().then(
    install(installDevDepsArgs, devDeps)
  );
}

function editBrowsersList() {
  const browserslist = ['> 1% in tw', 'last 3 versions', 'not ie <= 11'];
  return new Promise((resolve, reject) => {
    fs.writeFile('.browserslistrc', browserslist.join('\n'), err =>
      !err ? resolve() : reject(err)
    );
  });
}

function handleDistIgnore() {
  if (selection.function['add-dist-to-git-repo']) {
    fs.appendFileSync('.gitignore', '\n# add by ctare\n!/dist');
  }
}

function handleStorybook() {
  if (selection.plugin['storybook']) {
    return promiseSpawn('vue', ['add storybook'])
    .then(() => {
      child_process.execSync('\\rm -rf config/');
      const pkg = JSON.parse(fs.readFileSync('./package.json'))
      pkg['scripts']['storybook:serve'] = pkg['scripts']['storybook:serve'].replace('config/storybook', 'storybook')
      pkg['scripts']['storybook:build'] = pkg['scripts']['storybook:build'].replace('config/storybook', 'storybook')
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
      let content = fs.readFileSync('./src/stories/index.stories.js', {encoding: 'utf-8'})
      content = content.replace('../components/MyButton.vue', '@/components/MyButton.vue').replace('/* eslint-disable import/no-extraneous-dependencies */\n', '')
      fs.writeFileSync('./src/stories/index.stories.js', content)
    })
    .catch(code => {
      throw new Error('storybook process exited with error code ' + code);
    })
  }
}

function handleTags() {
  function tag2var(tag) {
    return tag.replace(/-/g, '_').replace(/\./g, '_').replace(/@/g, '$');
  }
  function expressionTransform(expression) {
    return expression.replace(/&/g, '&&').replace(/\|/g, '||');
  }
  // collect all feature tags
  const tags = {};
  Object.keys(features).forEach(category => {
    features[category].forEach(f => { tags[`${f.name}@${category}`] = !!selection[category][f.name] });
  });
  Object.keys(selection.internal).forEach(s => { tags[`${s}@internal`] = selection.internal[s] });

  // form a javascript code with the tags
  const vars = Object.keys(tags).map(t => `const ${tag2var(t)} = ${tags[t]};`).join('');

  // collect all expressions from files
  const expressions = {};
  files.forEach(filename => {
    const content = fs.readFileSync(filename, {encoding: 'utf-8'})
    content.match(/(?<=\[\[|\<\<)[a-z\-.@&|!]+/g).forEach(expression => {
      expressions[expression] = true;
    })
  })
  const expressionList = Object.keys(expressions);

  // form a javascript code from the expressions
  const statement = `[${expressionList.map(e => expressionTransform(tag2var(e))).join(',')}]`;
  const results = eval(vars + statement);
  expressionList.map((e, i) => {
    expressions[e] = results[i];
  });

  // remove unneed part from file
  files.forEach(filePath => {
    const lines = fs.readFileSync(filePath, {encoding: 'utf-8'}).split('\n');
    const newLines = [];
    let blockRemove = false;
    let blockTag = null;
    let previousBomb = false;
    lines.forEach(line => {
      const expressionMatch = line.match(/(\[\[|\<\<)([a-z\-.@&|!]+)/);
      const endMatch = line.match(/\<\<\/([a-z\-.@&|!]+)/);
      const bombAMatch = line.match(/(\[\[\]\])/);
      const bombBMatch = line.match(/(\[\[\/\]\])/);
      if (previousBomb && bombBMatch) newLines.pop();
      else if (endMatch) {
        if (endMatch[1] === blockTag) blockTag = null;
      }
      else if (blockTag) return;
      else if (expressionMatch) {
        if (expressionMatch[1] === '<<' && !expressions[expressionMatch[2]]) blockTag = expressionMatch[2];
        if (expressionMatch[1] === '[[' && expressions[expressionMatch[2]]) {
          previousBomb = !!bombAMatch;
          newLines.push(line);
        }
      }
      else {
        previousBomb = !!bombAMatch;
        newLines.push(line);
      }
    })
    let newContent = newLines.join('\n').replace(/ ?\/\/\[\[.*$/gm, '').replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(filePath, newContent);
  })
}

function addCommit() {
  child_process.execSync('git add .');
  child_process.execSync('git commit -m "setup"');
}

function promiseSpawn(command, args) {
  return new Promise((resolve, reject) => {
    child_process
      .spawn(command, args, { shell: true, stdio: 'inherit' })
      .on('close', code => (code === 0 ? resolve() : reject()));
  });
}
