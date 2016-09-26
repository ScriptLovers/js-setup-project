const fs       = require('fs');
const userHome = require('user-home');
const sh       = require('shelljs');
const GitHub   = require('github-api');

const fileOpts     = { encoding : 'utf8' };
const configFolder = `${userHome}/.setup-project`;
const configFile   = `${configFolder}/config.json`;

module.exports = {
  createRepo,
  loadConfig,
  replaceInFile
};

function createRepo(shouldCreate, token, name) {
  if (shouldCreate && token) {
    const user = new GitHub({ token }).getUser();
    return user
      .createRepo({
        name
      })
      .then(response => {
        const sshUrl = response.data.ssh_url;
        sh.exec(`git remote add origin ${sshUrl}`);
        return sshUrl;
      })
      .catch(err => console.error(`Error while creating GitHub repo : ${err}`));
  } else if (shouldCreate) {
    console.warn('GitHub token is missing. GitHub repo has not been created');
  }
  return Promise.resolve('');
}

function loadConfig() {
  // Create config folder
  if (!sh.test('-d', configFolder)) {
    sh.mkdir(configFolder);
  }

  // Create config file
  if (!sh.test('-f', configFile)) {
    sh.touch(configFile);
  }

  // Load config
  const config = fs.readFileSync(configFile, fileOpts);
  return config ? JSON.parse(config) : config;
}

function replaceInFile(fileName, map) {
  let file = fs.readFileSync(fileName, fileOpts);
  Object.keys(map).forEach(key => {
    const value = map[key];
    file = file.replace(key, value);
  });
  fs.writeFileSync(fileName, file, fileOpts);
}
