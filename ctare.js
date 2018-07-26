#!/usr/bin/env node

// load modules
const child_process = require('child_process');
const inquirer = require('inquirer');
const commandExistsSync = require('command-exists').sync;
const features = require('./lib/features');
const fs = require('fs')

// global variables
const selectedFeatures = {}

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
  // get features config
  process.stdout.write('\033c\033[3J'); // clear screen
  const choices = [
    new inquirer.Separator(' = Fonts = '),
    ...features.fonts,
    new inquirer.Separator(' = Modules = '),
    ...features.modules
  ]
  const questions = [
    {
      type: 'checkbox',
      message: 'Check the features needed for your project: ',
      name: 'features',
      pageSize: 12,
      choices
    }
  ];
  inquirer.prompt(questions).then(answers => {
    // parse selected features
    answers['features'].forEach(c => { selectedFeatures[c] = true; })

    // change main directory to project
    process.chdir(projectName)

    installModules()

  });
}

function installModules() {
  // determine package manager to use
  const hasYarn = fs.existsSync('yarn.lock');
  const installDepsProgram = hasYarn ? 'yarn' : 'npm';
  const installDepsArgs = hasYarn ? ['add'] : ['install', '--save'];
  const installDevDepsArgs = hasYarn ? ['add', '-D'] : ['install', '-D'];
  const devDeps = [
    'awesome-fontmin-loader',
    'charactor-scanner',
    'imagemin',
    'imagemin-gifsicle',
    'imagemin-mozjpeg',
    'imagemin-pngquant',
    'img-loader',
    'pug',
    'pug-plain-loader'
  ]

  // collect modules that need to installed
  const deps = features.modules.filter(c => selectedFeatures[c.name]).map(c => c.name);
  child_process.spawn(installDepsProgram, [...installDepsArgs, ...deps], {shell: true, stdio: 'inherit'})
  .on('close', code => {
    if (code !== 0) {
      console.log("dependencies install process exited with code " + code);
    }
    child_process.spawn(installDepsProgram, [...installDevDepsArgs, ...devDeps], {shell: true, stdio: 'inherit'})
    .on('close', code => {
      if (code !== 0) {
        console.log("devDependencies install process exited with code " + code);
      }
      editBrowsersList()
    })
  })
}

function editBrowsersList() {
  let packageJson = JSON.parse(fs.readFileSync('package.json'));
  packageJson.browserslist = ["> 1% in tw", "last 3 versions", "not ie <= 11"];
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  editGitIgnore()
}

function editGitIgnore() {
  fs.appendFileSync('.gitignore', '\n# add by ctare\nsrc/assets/fonts/')
  fetchFiles()
}

function fetchFiles() {
  if(fs.existsSync('ctare-cli')) child_process.execSync('\\rm -rf ctare-cli/')
  child_process.spawn('git', ['clone', 'https://github.com/andy23512/ctare-cli/'], {shell: true, stdio: 'inherit'})
  .on('close', code => {
    if (code !== 0) {
      console.log("git clone process exited with code " + code);
      copyFiles()
    }
  })
}

function copyFiles() {
  const hasRouter = fs.existsSync('./src/router.js');
  const hasStore = fs.existsSync('./src/store.js');
  child_process.execSync('cp ctare-cli/vue.config.js .');
  child_process.execSync('cp -rf ctare-cli/src .');
  if(!hasRouter) fs.unlinkSync('src/router.js');
  if(!hasStore) fs.unlinkSync('src/store.js');
  handleFonts();
}

function handleFonts() {
  console.log('nanoha')
  if(selectedFeatures['Noto Sans TC']) {
    console.log('fate')
    fs.mkdirSync('./src/assets/fonts/')
    const fontsUrls = [
      {host: "raw.githubusercontent.com", path: "/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Light.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Light.ttf"},
      {host: "raw.githubusercontent.com", path: "/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Regular.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Regular.ttf"},
      {host: "raw.githubusercontent.com", path: "/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Medium.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Medium.ttf"},
      {host: "raw.githubusercontent.com", path: "/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Bold.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Bold.ttf"}
    ]
    fontsUrls.forEach(downloadFile)
  }
  else fs.unlinkSync('src/assets/font.sass')
}

function downloadFile({host, path}) {
  console.log(downloadFile)
  const http = require('http');
  const options = { host, port: 443, path };
  const req = http.get(options, function(response) {
    // handle the response
    const res_data = '';
    response.on('data', chunk => { res_data += chunk; });
    response.on('end', () => { console.log(res_data) });
  });
  req.on('error', (err) => { console.log("Request error: " + err.message); });
}
