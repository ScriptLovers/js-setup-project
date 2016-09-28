#!/usr/bin/env node
const argv = require('yargs')
  .usage('Usage: $0 <name> -d [directory] -t [template] --github -o [githubToken]')
  .boolean('github')
  .alias('t', 'template')
  .alias('o', 'oauth')
  .alias('d', 'directory')
  .demand(1, ['t'])
  .argv;

const utils        = require('../utils');
const setupProject = require('../index');
// Load config
const config       = utils.loadConfig();
// Parse argv
const rootDir      = argv.directory;
const projectName  = argv._[0];
const template     = argv.template;
const token        = argv.oauth || config.token;
const github       = argv.github;

setupProject({
  rootDir,
  projectName,
  template,
  token,
  github
});
