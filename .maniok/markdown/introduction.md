# What is it?

The git-native solution for [C4](https://c4model.com/) architecture documentation. Like Docusaurus for architects without the setup overhead. This documentation, including all diagrams, is rendered from the Structurizr workspace at [https://github.com/danischuetz/maniok](https://github.com/danischuetz/maniok/tree/main/.maniok).

- Model and document architecture using Markdown and the [Structurizr DSL](https://docs.structurizr.com/dsl)
- Document alongside code - documentation lives in your GitHub repositories
- Share the documentation using a simple link, generated from your repository url

![Maniok Container View](embed:CoreContainerView)

# Quick Start

1. Run the [Maniok Architecture Prompt](https://github.com/danischuetz/maniok/blob/main/examples/maniok-architecture-prompt.md) in your repository to generate a C4 model from your codebase
    - Or create a [Structurizr](https://docs.structurizr.com/dsl) workspace yourself and put it in a `.maniok` folder at the root of your repository (**the workspace must be named workspace.dsl**)
2. Pull & run the Maniok-Preview Docker image, replacing `PATH` with the path to the created .maniok folder
    ```
    docker pull ghcr.io/danischuetz/maniok/maniok-preview:latest
    docker tag ghcr.io/danischuetz/maniok/maniok-preview maniok-preview
    docker run -t --rm -p 8080:8080 -v PATH:/usr/workspace maniok-preview:latest
    ```
3. Open the URL http://localhost:8080 in your browser and start editing. Maniok-Preview automatically exports your workspace and supports hot-reload! 🚀
4. Optional: Publish the changes, view and share the documentation via [https://app.maniok.io](https://app.maniok.io) (public repositories only atm)

# Features

- Minimal setup
- Minimal effort to maintain the documentation
- Documentation lives in your git repositories
    - Use your favorite IDE to edit the documentation
    - Enable AI-driven workflows e.g. through the use of GitHub Copilot
    - Use regular PRs to review documentation changes
    - Update documentation alongside code
    - You own your data
- Best-in-class diagrams auto-generated from your architecture
- Embed interactive diagrams in written documentation

# Community

Join us on GitHub to start a discussion, ask a question, or suggest a feature: <https://github.com/danischuetz/maniok/discussions>!

## Contact

- GitHub: <https://github.com/danischuetz/maniok>
- LinkedIn: <https://www.linkedin.com/in/schuetzdaniel>
- E-Mail: <daniel@danielschuetz.dev>

# Limitations and known issues

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
- Editing with auto-export has to be set up manually, see chapter [Editing](#editing) (It is planned to either provide a docker image or a VSCode extension for export/preview)
- Branch currently fixed to "HEAD"
