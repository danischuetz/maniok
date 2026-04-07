# What is it?

The git-native solution for C4 architecture documentation - like Docusaurus for architects, without the setup & hosting overhead.

- Model & document the architecture using Markdown and the Structurizr DSL
- Document alongside code - documentation lives in your GitHub repositories
- Viewers of your documentation visit [https://app.maniok.io](https://app.maniok.io) and enter the repo url

# How does it work?

The documentation must be placed in a dedicated folder `.maniok`, located at the root of each documented Github repository. Running the editor docker image, the documentation is automatically exported to a single file `<repository root>/.maniok/workspace.json` on documentation change, when running the

In a nutshell:

![core system overview](embed:CoreContainerView)

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

- In a repository root, create a folder called ".maniok"
- Download the [zipped default template](https://github.com/.../templates/default)
- Extract it to the .maniok folder
- Commit the changes
- Et voila, your documentation is online!

### Public Repositories

- Visit app.maniok.io
- Type your public repo URL

### Private Repositories

- Install the Maniok GitHub App for your repository
- Register / Log-In to your Maniok account at app.maniok.io
- Connect to your GitHub
