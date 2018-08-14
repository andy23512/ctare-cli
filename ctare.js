#!/usr/bin/env node

const child_process = require('child_process');
const commandExists = require('command-exists');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const request = require('request');
const url = require('url');

const features = require('./lib/features');
const devDeps = require('./lib/dev-deps');
const fontUrls = require('./lib/font-urls');

// global variables
const files = {
  'main.js': {
    path: 'src/main.js',
    toRemove: []
  },
  'global.sass': {
    path: 'src/assets/global.sass',
    toRemove: []
  },
  'vue.config.js': {
    path: 'vue.config.js',
    toRemove: []
  }
};
const selectedFeatures = {};
let projectName = '';

getProjectName()
  .then(() => commandExists('vue'))
  .then(checkVueCliVersion)
  .then(runVueCli)
  .then(getCtareConfig)
  .then(changeDirToProject)
  .then(installModules)
  .then(editBrowsersList)
  .then(cloneCtareSource)
  .then(copyFiles)
  .then(handleFonts)
  .then(handleModules)
  .then(removeFiles)
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
      const mainVersionNum = +stdout.toString().split('.')[0];
      mainVersionNum >= 3
        ? resolve()
        : reject(
            new Error(
              'Error: The version of installed Vue-cli < 3.0.0\nRun "yarn global install @vue/cli" or "npm install --global @vue/cli" to install the latest vue-cli.'
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

function getCtareConfig() {
  process.stdout.write('\033c\033[3J'); // clear screen
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Check the features needed for your project: ',
        name: 'features',
        pageSize: 12,
        choices: [
          new inquirer.Separator(' = Fonts = '),
          ...features.fonts,
          new inquirer.Separator(' = Modules = '),
          ...features.modules
        ]
      }
    ])
    .then(answers => {
      // parse selected features
      answers['features'].forEach(c => {
        selectedFeatures[c] = true;
      });
    });
}

function changeDirToProject() {
  return Promise.resolve(process.chdir(projectName));
}

function installDeps(program) {
  return (args, deps) => {
    return () => {
      if(deps.length > 0) {
        return promiseSpawn(program, [...args, ...deps]).catch(code => {
          throw new Error('Dependencies install process exited with code ' + code);
        });
      }
      else {
        return Promise.resolve();
      }
    }
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
  const deps = features.modules
    .filter(m => selectedFeatures[m.name])
    .reduce((acc, m) => acc.concat(m.packages), []);
  return install(installDepsArgs, deps)().then(
    install(installDevDepsArgs, devDeps)
  );
}

function editBrowsersList() {
  const browserslist = [
    '> 1% in tw',
    'last 3 versions',
    'not ie <= 11'
  ];
  return new Promise((resolve, reject) => {
    fs.writeFile(
      '.browserslistrc',
      browserslist.join('\n'),
      err => (!err ? resolve() : reject(err))
    );
  });
}

function cloneCtareSource() {
  return promiseSpawn('git', [
    'clone',
    'https://github.com/andy23512/ctare-cli/'
  ]).catch(code => {
    throw new Error('Clone CTARE github repo exited with error code' + code);
  });
}

function copyFiles() {
  const hasRouter = fs.existsSync('./src/router.js');
  const hasStore = fs.existsSync('./src/store.js');
  child_process.execSync('cp ctare-cli/vue.config.js .');
  child_process.execSync('cp -rf ctare-cli/src .');
  if (!hasRouter) {
    fs.unlinkSync('src/router.js');
    files['main.js'].toRemove.push('router');
  }
  if (!hasStore) {
    files['main.js'].toRemove.push('store');
  }
  child_process.execSync('\\rm -rf ctare-cli/');
}

function handleFonts() {
  if (selectedFeatures['Noto Sans TC']) {
    fs.appendFileSync('.gitignore', '\n# add by ctare\nsrc/assets/fonts/');
    if (!fs.existsSync('src/assets/fonts/')) fs.mkdirSync('src/assets/fonts/');
    fontUrls.forEach(downloadFont);
  } else {
    fs.unlinkSync('src/assets/font.sass');
    files['global.sass'].toRemove.push('font');
  }
}

function downloadFont(targetUrl) {
  const fileName = path.basename(url.parse(targetUrl).pathname);
  request(targetUrl).pipe(
    fs.createWriteStream(path.join('src/assets/fonts/', fileName))
  );
}

function handleModules() {
  features.modules.forEach(f => {
    if (selectedFeatures[f.name] || !f.affectedFile) return;
    files[f.affectedFile].toRemove.push(f.name);
  });
}

function removeFiles() {
  Object.values(files).forEach(f => {
    let fileContent = fs.readFileSync(f.path, { encoding: 'utf8' });
    for (const t of f.toRemove)
      fileContent = fileContent.replace(
        new RegExp(`(\\n|^).*\\[\\[${t}\\]\\]`, 'g'),
        ''
      );
    fileContent = fileContent.replace(/ \/\/\[\[.*$/gm, '');
    fs.writeFileSync(f.path, fileContent);
  });
}

function promiseSpawn(command, args) {
  return new Promise((resolve, reject) => {
    child_process
      .spawn(command, args, { shell: true, stdio: 'inherit' })
      .on('close', code => (code === 0 ? resolve() : reject()));
  });
}
