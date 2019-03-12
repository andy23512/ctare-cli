#!/usr/bin/env node

const child_process = require('child_process');
const commandExists = require('command-exists');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const request = require('request');
const rimraf = require('rimraf');
const url = require('url');

const features = require('./lib/features');
const fixedDevDeps = require('./lib/dev-deps');

// global variables
const files = {
  'main.js': {
    path: 'src/main.js',
    toRemove: []
  },
  'global.sass': {
    path: 'src/global.sass',
    toRemove: []
  },
  'vue.config.js': {
    path: 'vue.config.js',
    toRemove: []
  },
  'App.vue': {
    path: 'src/App.vue',
    toRemove: []
  },
  'store.js': {
    path: 'src/store.js',
    toRemove: []
  }
};
const complexToRemove = {
  '_app_created': {
    'affectedFiles': ['App.vue'],
    'deps': ['Save UTM', 'Check Mobile', 'axios']
  }
}
const selectedFeatures = {};
const setting = {};
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
  .then(copyFiles)
  .then(installModules)
  .then(editBrowsersList)
  .then(handleDistIgnore)
  .then(handleModules)
  .then(handleComplexToRemove)
  .then(removeUnneedFeautesImport)
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

function getProjectSetting() {
  setting.router = fs.existsSync('./src/router.js');
  setting.store = fs.existsSync('./src/store.js');
}

function getCtareConfig() {
  process.stdout.write('\033c\033[3J'); // clear screen
  const selectableFunctions = features.functions.filter((f) => {
    if(f.depend_on) {
      return f.depend_on.every(d => setting[d])
    }
    return true
  })
  if (selectableFunctions.length > 0) {
    selectableFunctions.unshift(new inquirer.Separator(' = Functions = '))
  }
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Check the features needed for your project: ',
        name: 'features',
        pageSize: 20,
        choices: [
          ...selectableFunctions,
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

function removeUnneedFile() {
  fs.unlinkSync('src/components/HelloWorld.vue')
  fs.unlinkSync('src/assets/logo.png')
  rimraf.sync('src/views/');
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
    rimraf.sync('src/views/');
    files['main.js'].toRemove.push('router');
    files['App.vue'].toRemove.push('router');
  }
  if (!hasStore) {
    fs.unlinkSync('src/store.js');
    files['main.js'].toRemove.push('store');
  }
  child_process.execSync('\\rm -rf ctare-cli/');
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
  const installed = features.modules
    .concat(features.functions)
    .filter(m => selectedFeatures[m.name])
  const deps = installed.reduce((acc, m) => acc.concat(m.packages), []);
  const devDeps = installed.reduce((acc, m) => acc.concat(m.devPackages), fixedDevDeps);
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

function handleDistIgnore() {
  if (selectedFeatures['Add Dist to Git Repo']) {
    fs.appendFileSync('.gitignore', '\n# add by ctare\n!/dist');
  }
}

function handleModules() {
  features.modules
  .concat(features.functions)
  .forEach(f => {
    if (!f.affectedFiles) return;
    if (selectedFeatures[f.name]) {
      if (f.cond) {
        f.cond.forEach(c => {
          if(selectedFeatures[c] || setting[c]) {
            f.affectedFiles.forEach(file => files[file].toRemove.push(`${f.name},!${c}`))
          }
          else {
            f.affectedFiles.forEach(file => files[file].toRemove.push(`${f.name},${c}`))
          }
        })
      }
    }
    else {
      f.affectedFiles.forEach(file => {
        files[file].toRemove.push(f.name);
      })
    }
  });
}

function handleComplexToRemove() {
  Object.keys(complexToRemove).forEach(name => {
    if(!complexToRemove[name].deps.some(f => selectedFeatures[f])) {
      complexToRemove[name].affectedFiles.forEach(file => files[file].toRemove.push(name))
    }
  })
}

function removeUnneedFeautesImport() {
  Object.values(files).forEach(f => {
    if (!fs.existsSync(f.path)) {
      return;
    }
    let fileContent = fs.readFileSync(f.path, { encoding: 'utf8' });
    for (const t of f.toRemove)
      fileContent = fileContent.replace(
        new RegExp(`\\n.*\\[\\[${t}(,.*?)?\\]\\]`, 'g'),
        ''
      ).replace(
        new RegExp(`^.*\\[\\[${t}(,.*?)?\\]\\]\\n`, 'g'),
        ''
      );
    fileContent = fileContent.replace(/ ?\/\/\[\[.*$/gm, '');
    fileContent = fileContent.replace(/\n{3,}/g, '\n\n');
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
