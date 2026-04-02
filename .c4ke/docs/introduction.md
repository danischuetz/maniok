# What is it?

TODO: add editing interactions to architecture...

The git-native solution for C4 architecture documentation - like Docusaurus for architects, with C4 diagrams-as-code but without the setup overhead.

The whole documentation lives in a single file in your github repository, `.c4ke/workspace.json`,which is then rendered by the c4ke.io webapp.

Here is how it works:

![c4ke system overview](embed:CoreContainerView)

## GitHub

For a test, let's checkout the github container view:

![github system overview](embed:GitHubContainerView)

## Features

- Minimal setup
- Minimal effort to maintain the documentation
- Documentation lives in your git repositories
    - Use your favorite IDE to edit the documentation
    - Enables AI-driven workflows e.g. through the use of GitHub Copilot
    - Use regular PRs to review documentation changes
    - Update documentation alongside code
    - Protects your IP - your data never touches our backends
- Best-in-class diagrams auto-generated from your architecture
- Embed interactive diagrams in written documentation

## Requirements

- Github hosted repositories only

## Quick Start

### Documentation Setup

- In a repository root, create a folder called ".c4ke"
- Download the [zipped default template](https://github.com/danischuetz/c4ke-webapp/templates/default)
- Extract it to the .c4ke folder
- Commit the changes
- Et voila, your documentation is online!

### Public Repositories

- Visit app.c4ke.io
- Type your public repo URL

### Private Repositories

- Install the c4ke GitHub App for your repository
- Register / Log-In to your c4ke account at app.c4ke.io
- Connect to your GitHub
