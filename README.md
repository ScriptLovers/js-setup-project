# Setup project

## Install

    npm i -g setup-project

## Usage

    setup-project <projectName> -t <template> -o <githubToken> --github

## Examples

- Create a node project

        setup-project exampleProject -t node


- Create a react project

        setup-project exampleProject -t react


- Create a react-native project

        setup-project exampleProject -t react-native

- Create a node project with creation of a GitHub repo (GitHub token will be looked for in ``~/.setup-project/config.json``)

        setup-project exampleProject -t node --github
