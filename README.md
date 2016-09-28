# Setup project

## Global

### Install

    npm i -g setup-project

### Usage

    setup-project <projectName> -d [directory] -t <template> -o <githubToken> --github

### Examples

- Create a node project in ``~/Dev`` directory

        setup-project exampleProject -d ~/Dev -t node


- Create a react project in ``~/Dev`` directory

        setup-project exampleProject -d ~/Dev -t react


- Create a react-native project in ``~/Dev`` directory

        setup-project exampleProject -d ~/Dev -t react-native

- Create a node project with creation of a GitHub repo (GitHub token will be looked for in ``~/.setup-project/config.json``)

        setup-project exampleProject -d ~/Dev -t node --github

## Lib

### Install

    npm i setup-project

### Examples

- Create a node project in ``~/Dev`` directory

```javascript
const setupProject = require('setup-project');

setupProject({
  rootDir : '~/Dev',
  projectName : 'example',
  template : 'node'
});
```

- Create a react project in ``~/Dev`` directory

```javascript
const setupProject = require('setup-project');

setupProject({
  rootDir : '~/Dev',
  projectName : 'example',
  template : 'react'
});
```


- Create a react-native project in ``~/Dev`` directory

```javascript
const setupProject = require('setup-project');

setupProject({
  rootDir : '~/Dev',
  projectName : 'example',
  template : 'react-native'
});
```

- Create a node project with creation of a GitHub repo in ``~/Dev`` directory

```javascript
const setupProject = require('setup-project');

setupProject({
  rootDir : '~/Dev',
  projectName : 'example',
  template : 'node',
  token : 'mygithubpersonalaccesstoken',
  github : true
});
```
