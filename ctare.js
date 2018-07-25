#!/usr/bin/env node

// load modules
const child_process = require('child_process');
const inquirer = require('inquirer');
const commandExistsSync = require('command-exists').sync;

// get project name
const projectName = process.argv[2];
if (!projectName) {
  console.log('Usage: ./ctare.js <project-name>');
  process.exit(1);
}

// check if vue-cli is globally installed
if (!commandExistsSync('vue')) {
  console.log('Error: Vue-cli is not globally installed in this computer.');
  console.log('Run "yarn global install @vue/cli" or "npm install --global @vue/cli" to install it.');
  process.exit(1);
}

// check version of vue-cli
const version = child_process.execSync('vue -V');
const mainVersionNum = +version.toString().split('.')[0];
if (mainVersionNum < 3) {
  console.log("Error: The version of installed Vue-cli < 3.0.0");
  console.log('Run "yarn global install @vue/cli" or "npm install --global @vue/cli" to install the latest vue-cli.');
  process.exit(1);
}

// execute vue-cli
child_process.spawn('vue', ['create', projectName], {shell: true, stdio: 'inherit'})
.on('close', (code) => {
  if (code !== 0) {
    console.log("vue-cli process exited with code " + code);
  }
  ctareConfig();
});

function ctareConfig() {
  // get feature config
  process.stdout.write('\033c\033[3J'); // clear screen
  const questions = [
    {
      type: 'checkbox',
      message: 'Check the features / modules needed for your project: ',
      name: 'features',
      pageSize: 12,
      choices: [
        new inquirer.Separator(' = Fonts = '),
        { name: 'Noto Sans TC', checked: true },
        new inquirer.Separator(' = Modules = '),
        { name: 'axios' },
        { name: 'jquery', checked: true },
        { name: 'ramdajs' },
        { name: 'rxjs' },
        { name: 'semantic-ui-css' },
        { name: 'semantic-ui-reset', checked: true },
        { name: 'vue-analystics' },
        { name: 'vue-scrollto' }
      ]
    }
  ];
  inquirer.prompt(questions).then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });
}
