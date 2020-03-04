#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
// tslint:disable: no-console
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
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getProjectName();
                return [4 /*yield*/, command_exists_1.default('vue')];
            case 1:
                _a.sent();
                return [4 /*yield*/, checkVueCliVersion()];
            case 2:
                _a.sent();
                return [4 /*yield*/, runVueCli()];
            case 3:
                _a.sent();
                return [4 /*yield*/, changeDirToProject()];
            case 4:
                _a.sent();
                getProjectSetting();
                return [4 /*yield*/, getCtareConfig()];
            case 5:
                _a.sent();
                removeNotNeedFile();
                return [4 /*yield*/, cloneCtareSource()];
            case 6:
                _a.sent();
                handleFavicon();
                copyFiles();
                return [4 /*yield*/, installModules()];
            case 7:
                _a.sent();
                return [4 /*yield*/, editBrowsersList()];
            case 8:
                _a.sent();
                handleDistIgnore();
                return [4 /*yield*/, handleStorybook()];
            case 9:
                _a.sent();
                handleTags();
                addCommit();
                return [2 /*return*/];
        }
    });
}); })();
function getProjectName() {
    projectName = process.argv[2];
    if (!projectName) {
        throw new Error('Error: No project name is given\nUsage: ./ctare.js <project-name>');
    }
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, promiseSpawn('vue', ['create', projectName]).catch(function (code) {
                    throw new Error('Vue-cli process exited with error code ' + code);
                })];
        });
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
    return __awaiter(this, void 0, void 0, function () {
        var selectableFunctions;
        return __generator(this, function (_a) {
            console.clear();
            selectableFunctions = constants_1.features.function.filter(function (f) {
                if (f.dependOn) {
                    return f.dependOn.every(function (d) { return selection.internal[d]; });
                }
                return true;
            });
            return [2 /*return*/, inquirer_1.default
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
                    Object.entries(answers).forEach(function (_a) {
                        var category = _a[0], categoryAnswers = _a[1];
                        var categorySelection = {};
                        categoryAnswers.forEach(function (c) {
                            categorySelection[c] = true;
                        });
                        selection[category] = categorySelection;
                    });
                })];
        });
    });
}
function changeDirToProject() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve(process.chdir(projectName))];
        });
    });
}
function removeNotNeedFile() {
    if (fs_1.default.existsSync('src/components/HelloWorld.vue'))
        fs_1.default.unlinkSync('src/components/HelloWorld.vue');
    if (fs_1.default.existsSync('src/assets/logo.png'))
        fs_1.default.unlinkSync('src/assets/logo.png');
    rimraf_1.default.sync('src/views/');
}
function cloneCtareSource() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, promiseSpawn('git', [
                    'clone',
                    '--depth',
                    '1',
                    'https://github.com/andy23512/ctare-cli/'
                ]).catch(function (code) {
                    throw new Error('Clone CTARE github repo exited with error code' + code);
                })];
        });
    });
}
function copyFiles() {
    var hasRouter = selection.internal.router;
    var hasStore = selection.internal.store;
    child_process_1.default.execSync('cp ctare-cli/project/vue.config.js .');
    child_process_1.default.execSync('cp -rf ctare-cli/project/src .');
    child_process_1.default.execSync('cp -rf ctare-cli/project/public/index.html ./public/');
    if (!hasRouter) {
        rimraf_1.default.sync('src/router/');
        rimraf_1.default.sync('src/views/');
    }
    if (!hasStore) {
        rimraf_1.default.sync('src/store/');
    }
    if (selection.plugin.storybook) {
        child_process_1.default.execSync('cp -rf ctare-cli/project/storybook .');
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
        child_process_1.default.execSync('cp -rf ctare-cli/project/public/favicon.ico ./public/');
    }
}
function installDeps(program) {
    var _this = this;
    return function (args, deps) {
        return function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (deps.length > 0) {
                    return [2 /*return*/, promiseSpawn(program, __spreadArrays(args, deps)).catch(function (code) {
                            throw new Error('Dependencies install process exited with code ' + code);
                        })];
                }
                else {
                    return [2 /*return*/, Promise.resolve()];
                }
                return [2 /*return*/];
            });
        }); };
    };
}
function installModules() {
    return __awaiter(this, void 0, void 0, function () {
        var hasYarn, installDepsProgram, installDepsArgs, installDevDepsArgs, install, deps, devDeps;
        return __generator(this, function (_a) {
            hasYarn = fs_1.default.existsSync('yarn.lock');
            installDepsProgram = hasYarn ? 'yarn' : 'npm';
            installDepsArgs = hasYarn ? ['add'] : ['install', '--save'];
            installDevDepsArgs = hasYarn ? ['add', '-D'] : ['install', '-D'];
            install = installDeps(installDepsProgram);
            deps = constants_1.fixedDeps;
            devDeps = constants_1.fixedDevDeps;
            Object.entries(constants_1.features).forEach(function (_a) {
                var category = _a[0], categoryFeatures = _a[1];
                categoryFeatures.forEach(function (feature) {
                    if (selection[category][feature.name]) {
                        if (feature.packages)
                            deps = deps.concat(feature.packages);
                        if (feature.devPackages)
                            devDeps = devDeps.concat(feature.devPackages);
                    }
                });
            });
            return [2 /*return*/, install(installDepsArgs, deps)().then(install(installDevDepsArgs, devDeps))];
        });
    });
}
function editBrowsersList() {
    return __awaiter(this, void 0, void 0, function () {
        var browserslist;
        return __generator(this, function (_a) {
            browserslist = ['> 1% in tw', 'last 3 versions', 'not ie <= 11'];
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.writeFile('.browserslistrc', browserslist.join('\n'), function (err) {
                        return !err ? resolve() : reject(err);
                    });
                })];
        });
    });
}
function handleDistIgnore() {
    if (selection.function['add-dist-to-git-repo']) {
        fs_1.default.appendFileSync('.gitignore', '\n# add by ctare\n!/dist');
    }
}
function handleStorybook() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (selection.plugin.storybook) {
                return [2 /*return*/, promiseSpawn('vue', ['add storybook'])
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
                    })];
            }
            return [2 /*return*/];
        });
    });
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
        if (content) {
            (content.match(/(?<=\[\[|\<\<)[a-z\-.@&|!]+/g) || []).forEach(function (expression) {
                expressions[expression] = true;
            });
        }
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    child_process_1.default
                        .spawn(command, args, { shell: true, stdio: 'inherit' })
                        .on('close', function (code) { return (code === 0 ? resolve() : reject()); });
                })];
        });
    });
}
