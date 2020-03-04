#!/usr/bin/env node
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = __importDefault(require("child_process"));
var fs_1 = __importDefault(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var rimraf_1 = __importDefault(require("rimraf"));
var command_exists_1 = __importDefault(require("command-exists"));
var constants_1 = require("./constants");
// global variables
var files = [
    'src/App.vue',
    'src/global.sass',
    'src/main.js',
    'vue.config.js'
];
var selection = {};
var projectName = '';
getProjectName()
    .then(function () { return command_exists_1.default('vue'); })
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
    // tslint:disable-next-line: no-console
    .catch(console.error);
function getProjectName() {
    return new Promise(function (resolve, reject) {
        projectName = process.argv[2];
        projectName
            ? resolve(projectName)
            : reject(new Error('Error: No project name is given\nUsage: ./ctare.js <project-name>'));
    });
}
function checkVueCliVersion() {
    return new Promise(function (resolve, reject) {
        child_process_1.default.exec('vue -V', function (err, stdout, stderr) {
            var mainVersionNum = +stdout
                .toString()
                .replace('@vue/cli ', '')
                .split('.')[0];
            mainVersionNum >= 4
                ? resolve()
                : reject(new Error('Error: The version of installed Vue-cli < 4.0.0\nRun "yarn global install @vue/cli" or "npm install --global @vue/cli" to install the latest vue-cli.'));
        });
    });
}
function runVueCli() {
    return promiseSpawn('vue', ['create', projectName]).catch(function (code) {
        throw new Error('Vue-cli process exited with error code ' + code);
    });
}
function getProjectSetting() {
    selection.internal = {
        router: fs_1.default.existsSync('./src/router/index.js'),
        store: fs_1.default.existsSync('./src/store/index.js')
    };
    if (selection.internal.store) {
        files.push('src/store/index.js');
    }
}
function getCtareConfig() {
    process.stdout.write('\033c\033[3J'); // clear screen
    var selectableFunctions = constants_1.features.function.filter(function (f) {
        if (f.depend_on) {
            return f.depend_on.every(function (d) { return selection.internal[d]; });
        }
        return true;
    });
    return inquirer_1.default
        .prompt([
        {
            type: 'checkbox',
            message: 'Check the fonts needed for your project: ',
            name: 'font',
            choices: constants_1.features.font
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
            message: "Check the modules needed for your project (" + constants_1.fixedDeps.join(', ') + " will be installed): ",
            name: 'module',
            choices: constants_1.features.module
        },
        {
            type: 'checkbox',
            message: 'Check the plugins needed for your project: ',
            name: 'plugin',
            choices: constants_1.features.plugin
        },
        {
            type: 'checkbox',
            message: 'Check the other functions needed for your project: ',
            name: 'other',
            choices: constants_1.features.other
        }
    ])
        .then(function (answers) {
        // parse selected features
        Object.keys(answers).forEach(function (category) {
            var categorySelection = {};
            answers[category].forEach(function (c) {
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
    if (fs_1.default.existsSync('src/components/HelloWorld.vue'))
        fs_1.default.unlinkSync('src/components/HelloWorld.vue');
    if (fs_1.default.existsSync('src/assets/logo.png'))
        fs_1.default.unlinkSync('src/assets/logo.png');
    rimraf_1.default.sync('src/views/');
}
function cloneCtareSource() {
    return promiseSpawn('git', [
        'clone',
        '-b',
        'typescript',
        '--single-branch',
        '--depth',
        '1',
        'https://github.com/andy23512/ctare-cli/'
    ]).catch(function (code) {
        throw new Error('Clone CTARE github repo exited with error code' + code);
    });
}
function copyFiles() {
    var hasRouter = selection.internal.router;
    var hasStore = selection.internal.store;
    child_process_1.default.execSync('cp ctare-cli/vue.config.js .');
    child_process_1.default.execSync('cp -rf ctare-cli/src .');
    child_process_1.default.execSync('cp -rf ctare-cli/public/index.html ./public/');
    if (!hasRouter) {
        rimraf_1.default.sync('src/router/');
        rimraf_1.default.sync('src/views/');
    }
    if (!hasStore) {
        rimraf_1.default.sync('src/store/');
    }
    if (selection.plugin.storybook) {
        child_process_1.default.execSync('cp -rf ctare-cli/storybook .');
        files.push('storybook/config.js');
    }
    else {
        fs_1.default.unlinkSync('src/storybook.sass');
    }
    if (!selection.plugin.storybook || !hasStore) {
        fs_1.default.unlinkSync('src/StoreMock.js');
    }
    child_process_1.default.execSync('\\rm -rf ctare-cli/');
}
function handleFavicon() {
    if (selection.other['tech-orange-favicon']) {
        child_process_1.default.execSync('cp -rf ctare-cli/public/favicon.ico ./public/');
    }
}
function installDeps(program) {
    return function (args, deps) {
        return function () {
            if (deps.length > 0) {
                return promiseSpawn(program, __spreadArrays(args, deps)).catch(function (code) {
                    throw new Error('Dependencies install process exited with code ' + code);
                });
            }
            else {
                return Promise.resolve();
            }
        };
    };
}
function installModules() {
    // determine package manager to use
    var hasYarn = fs_1.default.existsSync('yarn.lock');
    var installDepsProgram = hasYarn ? 'yarn' : 'npm';
    var installDepsArgs = hasYarn ? ['add'] : ['install', '--save'];
    var installDevDepsArgs = hasYarn ? ['add', '-D'] : ['install', '-D'];
    var install = installDeps(installDepsProgram);
    // collect modules that need to installed
    var deps = constants_1.fixedDeps;
    var devDeps = constants_1.fixedDevDeps;
    Object.keys(constants_1.features).forEach(function (category) {
        constants_1.features[category].forEach(function (feature) {
            if (selection[category][feature.name]) {
                if (feature.packages)
                    deps = deps.concat(feature.packages);
                if (feature.devPackages)
                    devDeps = devDeps.concat(feature.devPackages);
            }
        });
    });
    return install(installDepsArgs, deps)().then(install(installDevDepsArgs, devDeps));
}
function editBrowsersList() {
    var browserslist = ['> 1% in tw', 'last 3 versions', 'not ie <= 11'];
    return new Promise(function (resolve, reject) {
        fs_1.default.writeFile('.browserslistrc', browserslist.join('\n'), function (err) {
            return !err ? resolve() : reject(err);
        });
    });
}
function handleDistIgnore() {
    if (selection.function['add-dist-to-git-repo']) {
        fs_1.default.appendFileSync('.gitignore', '\n# add by ctare\n!/dist');
    }
}
function handleStorybook() {
    if (selection.plugin.storybook) {
        return promiseSpawn('vue', ['add storybook'])
            .then(function () {
            child_process_1.default.execSync('\\rm -rf config/');
            var pkg = JSON.parse(fs_1.default.readFileSync('./package.json', { encoding: 'utf-8' }));
            pkg.scripts['storybook:serve'] = pkg.scripts['storybook:serve'].replace('config/storybook', 'storybook');
            pkg.scripts['storybook:build'] = pkg.scripts['storybook:build'].replace('config/storybook', 'storybook');
            fs_1.default.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
            var content = fs_1.default.readFileSync('./src/stories/index.stories.js', {
                encoding: 'utf-8'
            });
            content = content
                .replace('../components/MyButton.vue', '@/components/MyButton.vue')
                .replace('/* eslint-disable import/no-extraneous-dependencies */\n', '');
            fs_1.default.writeFileSync('./src/stories/index.stories.js', content);
        })
            .catch(function (code) {
            throw new Error('storybook process exited with error code ' + code);
        });
    }
}
function handleTags() {
    function tag2var(tag) {
        return tag
            .replace(/-/g, '_')
            .replace(/\./g, '_')
            .replace(/@/g, '$');
    }
    function expressionTransform(expression) {
        return expression.replace(/&/g, '&&').replace(/\|/g, '||');
    }
    // collect all feature tags
    var tags = {};
    Object.keys(constants_1.features).forEach(function (category) {
        constants_1.features[category].forEach(function (f) {
            tags[f.name + "@" + category] = !!selection[category][f.name];
        });
    });
    Object.keys(selection.internal).forEach(function (s) {
        tags[s + "@internal"] = selection.internal[s];
    });
    // form a javascript code with the tags
    var vars = Object.keys(tags)
        .map(function (t) { return "const " + tag2var(t) + " = " + tags[t] + ";"; })
        .join('');
    // collect all expressions from files
    var expressions = {};
    files.forEach(function (filename) {
        var content = fs_1.default.readFileSync(filename, { encoding: 'utf-8' });
        content.match(/(?<=\[\[|\<\<)[a-z\-.@&|!]+/g).forEach(function (expression) {
            expressions[expression] = true;
        });
    });
    var expressionList = Object.keys(expressions);
    // form a javascript code from the expressions
    var statement = "[" + expressionList
        .map(function (e) { return expressionTransform(tag2var(e)); })
        .join(',') + "]";
    // tslint:disable-next-line: no-eval
    var results = eval(vars + statement);
    expressionList.map(function (e, i) {
        expressions[e] = results[i];
    });
    // remove unneed part from file
    files.forEach(function (filePath) {
        var lines = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' }).split('\n');
        var newLines = [];
        var blockTag = null;
        var previousBomb = false;
        lines.forEach(function (line) {
            var expressionMatch = line.match(/(\[\[|\<\<)([a-z\-.@&|!]+)/);
            var endMatch = line.match(/\<\<\/([a-z\-.@&|!]+)/);
            var bombAMatch = line.match(/(\[\[\]\])/);
            var bombBMatch = line.match(/(\[\[\/\]\])/);
            if (previousBomb && bombBMatch)
                newLines.pop();
            else if (endMatch) {
                if (endMatch[1] === blockTag)
                    blockTag = null;
            }
            else if (blockTag)
                return;
            else if (expressionMatch) {
                if (expressionMatch[1] === '<<' && !expressions[expressionMatch[2]])
                    blockTag = expressionMatch[2];
                if (expressionMatch[1] === '[[' && expressions[expressionMatch[2]]) {
                    previousBomb = !!bombAMatch;
                    newLines.push(line);
                }
            }
            else {
                previousBomb = !!bombAMatch;
                newLines.push(line);
            }
        });
        var newContent = newLines
            .join('\n')
            .replace(/ ?\/\/\[\[.*$/gm, '')
            .replace(/\n{3,}/g, '\n\n');
        fs_1.default.writeFileSync(filePath, newContent);
    });
}
function addCommit() {
    child_process_1.default.execSync('git add .');
    child_process_1.default.execSync('git commit -m "setup"');
}
function promiseSpawn(command, args) {
    return new Promise(function (resolve, reject) {
        child_process_1.default
            .spawn(command, args, { shell: true, stdio: 'inherit' })
            .on('close', function (code) { return (code === 0 ? resolve() : reject()); });
    });
}
