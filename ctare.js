#!/usr/bin/env node

// load modules
const child_process = require('child_process');
const inquirer = require('inquirer');
const commandExistsSync = require('command-exists').sync

// get project name
const projectName = process.argv[2];
if (!projectName) {
  console.log('Usage: ./ctare.js <project-name>');
  process.exit(1);
}

// check if vue-cli is globally installed
if (!commandExistsSync('vue')) {
  console.log('Error: Vue-cli is not installed in this computer.')
  process.exit(1)
}

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
