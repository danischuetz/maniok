# What is it?

The git-native solution for C4 architecture documentation. Like Docusaurus for architects without the setup overhead. This documentation is rendered from the structurizr workspace at [https://github.com/danischuetz/maniok](https://github.com/danischuetz/maniok).

Based on an ODI (Outcome Driven Innovation) resarch of current pain points in documenting software architecture.

- Model and document architecture using Markdown and the Structurizr DSL
- Document alongside code - documentation lives in your GitHub repositories
- Direct access [https://app.maniok.io](https://app.maniok.io) and the repository url

For documentation to be discovered by the Maniok webapp, it must be placed in a dedicated folder `.maniok` at the root of each documented Github repository. Running the Maniok-Editor docker image, the documentation is automatically exported to a single file `<repository root>/.maniok/workspace.json` on save and can be previewed locally.

![Maniok Container View](embed:CoreContainerView)

## Features

- Minimal setup
- Minimal effort to maintain the documentation
- Documentation lives in your git repositories
    - Use your favorite IDE to edit the documentation
    - Enable AI-driven workflows e.g. through the use of GitHub Copilot
    - Use regular PRs to review documentation changes
    - Update documentation alongside code
    - Protects your IP - your data never touches our backends
- Best-in-class diagrams auto-generated from your architecture
- Embed interactive diagrams in written documentation

## POC

This is a very first proof of concept to validate the concept and to collect feedback.

- It does currently work on **open source repositories only**
- The Structurizr DSL is only partially supported (Markdown, SystemContextViews, ContainerViews, ComponentViews)
- Known issues
    - Diagrams
        - Missing edge routing (on some diagrams edges collide with nodes)
        - Edge label collisons (Sometimes labels hide other labels / label-edge association not clear)
        - Edge label missing for multiple connections between same nodes
    - Navigation
        - Switching to chapter in other document node doesn't scroll to correct chapter

## Quick Start

- In a public repository, create a folder called ".maniok"
- Download the [example documentation](https://github.com/danischuetz/maniok/blob/example.zip) (which is the documentation you are currently reading)
- Extract it to the .maniok folder
- Commit the changes
- Visit [https://app.maniok.io](https://app.maniok.io) and type your repository url
