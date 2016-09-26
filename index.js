#!/usr/bin/env node
const sh   = require('shelljs');
const fs   = require('fs');
const argv = require('yargs')
  .usage('Usage: $0 <name> -t [template]')
  .alias('t', 'template')
  .demand(1, ['t'])
  .argv;

const NODE_KEY         = 'node';
const REACT_KEY        = 'react';
const REACT_NATIVE_KEY = 'react-native';
const templateDir      = `${__dirname}/templates`;
const fileOpts         = { encoding : 'utf8' };

const projectName = argv._[0];

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

// Replace in templates
fs.writeFileSync('package.json', fs.readFileSync('package.json', fileOpts).replace('<project>', projectName), fileOpts);
fs.writeFileSync('README.md', fs.readFileSync('README.md', fileOpts).replace('<project>', projectName), fileOpts);
console.log('Variables replaced');

// Install devDependencies
console.log('Installing dependencies... It may takes a while...');
sh.exec('npm i --save-dev eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react');

// Init git
sh.exec('git init');

console.log('Project has been setup');
