#!/usr/bin/env node
const sh       = require('shelljs');
const utils    = require('./utils');
const argv     = require('yargs')
  .usage('Usage: $0 <name> -t [template] --github -o [githubToken]')
  .boolean('github')
  .alias('t', 'template')
  .alias('o', 'oauth')
  .demand(1, ['t'])
  .argv;

const NODE_KEY         = 'node';
const REACT_KEY        = 'react';
const REACT_NATIVE_KEY = 'react-native';
const templateDir      = `${__dirname}/templates`;

const projectName = argv._[0];

// Load config
const config = utils.loadConfig();

// Create project dir
sh.mkdir(projectName);
sh.cd(projectName);
console.log('Project directory created');

// Paste templates
sh.cp(`${templateDir}/.gitignore.template`, '.gitignore');
sh.cp(`${templateDir}/package.template.json`, 'package.json');
sh.cp(`${templateDir}/index.template.js`, 'index.js');
sh.chmod('u+x', 'index.js');
sh.cp(`${templateDir}/README.template.md`, 'README.md');
switch (argv.template) {
  case NODE_KEY:
    sh.cp(`${templateDir}/.eslintrc.node.template.json`, '.eslintrc.json');
    break;
  case REACT_KEY:
    sh.cp(`${templateDir}/.eslintrc.react.template.json`, '.eslintrc.json');
    break;
  case REACT_NATIVE_KEY:
    sh.cp(`${templateDir}/.eslintrc.react-native.template.json`, '.eslintrc.json');
    break;
  default:
    console.error('Invalid template key');
}
console.log('Template pasted');

// Init git
sh.exec('git init');

// Create GitHub repo if needed
const token = argv.oauth || config.token;
utils
  .createRepo(argv.github, token, projectName)
  .then(sshUrl => {
    // Replace in templates
    const templateVariables = {
      '<project>'    : projectName,
      '<repoSshUrl>' : sshUrl
    };
    utils.replaceInFile('package.json', templateVariables);
    utils.replaceInFile('README.md', templateVariables);
    console.log('Variables replaced');

    // Install devDependencies
    console.log('Installing dependencies... It may takes a while...');
    sh.exec('npm i --save-dev eslint eslint-config-airbnb eslint-plugin-import' +
      ' eslint-plugin-jsx-a11y eslint-plugin-react');

    console.log('Project has been setup');
  });
