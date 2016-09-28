#!/usr/bin/env node
const sh    = require('shelljs');
const utils = require('./utils');
const path  = require('path');
const chalk = require('chalk');

// Template keys
const NODE_KEY         = 'node';
const REACT_KEY        = 'react';
const REACT_NATIVE_KEY = 'react-native';
// Templates
const templateDir               = path.join(__dirname, 'templates');
const gitignoreTemplate         = path.join(templateDir, '.gitignore.template');
const packageTemplate           = path.join(templateDir, 'package.template.json');
const indexTemplate             = path.join(templateDir, 'index.template.js');
const binIndexTemplate          = path.join(templateDir, 'bin-index.template.js');
const readmeTemplate            = path.join(templateDir, 'README.template.md');
const eslintNodeTemplate        = path.join(templateDir, '.eslintrc.node.template.json');
const eslintReactTemplate       = path.join(templateDir, '.eslintrc.react.template.json');
const eslintReactNativeTemplate = path.join(templateDir, '.eslintrc.react-native.template.json');

module.exports = setupProject;

function setupProject({ rootDir, projectName, template, token, github }) {
  // Project files
  const projectDir    = path.join(rootDir, projectName);
  const binDir        = path.join(projectDir, 'bin');
  const gitignoreFile = path.join(projectDir, '.gitignore');
  const packageFile   = path.join(projectDir, 'package.json');
  const indexFile     = path.join(projectDir, 'index.js');
  const readmeFile    = path.join(projectDir, 'README.md');
  const eslintFile    = path.join(projectDir, '.eslintrc.json');
  const binIndexFile  = path.join(binDir, 'index.js');

  // Create project dir
  sh.mkdir(projectDir);
  sh.mkdir(binDir);
  sh.cd(projectDir);
  console.log(chalk.green('Project directory created'));

  // Create project files from templates
  sh.cp(gitignoreTemplate, gitignoreFile);
  sh.cp(packageTemplate, packageFile);
  sh.cp(indexTemplate, indexFile);
  sh.cp(binIndexTemplate, binIndexFile);
  sh.chmod('u+x', binIndexFile);
  sh.cp(readmeTemplate, readmeFile);
  switch (template) {
    case NODE_KEY:
      sh.cp(eslintNodeTemplate, eslintFile);
      break;
    case REACT_KEY:
      sh.cp(eslintReactTemplate, eslintFile);
      break;
    case REACT_NATIVE_KEY:
      sh.cp(eslintReactNativeTemplate, eslintFile);
      break;
    default:
      console.error(chalk.red('Invalid template key'));
  }
  console.log(chalk.green('Template pasted'));

  // Init git
  sh.exec('git init');

  // Create GitHub repo if needed
  utils
    .createRepo(github, token, projectName)
    .then(sshUrl => {
      // Replace in templates
      const templateVariables = {
        '<project>'    : projectName,
        '<repoSshUrl>' : sshUrl
      };
      utils.replaceInFile(packageFile, templateVariables);
      utils.replaceInFile(readmeFile, templateVariables);
      console.log(chalk.green('Variables replaced'));

      // Install devDependencies
      console.log(chalk.blue('Installing dependencies... It may takes a while...'));
      sh.exec('npm i --save-dev eslint eslint-config-airbnb eslint-plugin-import' +
        ' eslint-plugin-jsx-a11y eslint-plugin-react');

      console.log(chalk.green('Project has been setup'));
    });
}
