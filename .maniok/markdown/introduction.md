# What is it?

The git-native solution for C4 architecture documentation. Like Docusaurus for architects without the setup overhead. This documentation, including all diagrams, is rendered from the structurizr workspace at [https://github.com/danischuetz/maniok](https://github.com/danischuetz/maniok/tree/main/.maniok).

- Model and document architecture using Markdown and the Structurizr DSL
- Document alongside code - documentation lives in your GitHub repositories
- Direct access [https://app.maniok.io](https://app.maniok.io) and the repository url

For documentation to be discovered by the Maniok webapp, it must be placed in a dedicated folder `.maniok` at the root of each documented Github repository.

![Maniok Container View](embed:CoreContainerView)

## Features

Based on an ODI (Outcome Driven Innovation) resarch of current pain points in documenting software architecture, Maniok features:

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
- Editing with auto-export has to be set up manually, see chapter [Editing](#editing) (It is planned to either provide a docker image or a VSCode extension for export/preview)
- Branch currently fixed to "HEAD"

## Contact, Updates & Early Access

You can contact me via

- E-Mail: <daniel@danielschuetz.dev>
- LinkedIn: <https://www.linkedin.com/in/schuetzdaniel>

If you want to receive updates and be considered for early access to the developed tooling, you can leave your email address here: <https://forms.gle/pt5bWiQCqMBqNqmf7>

# Quick Start

- In a public repository, create a folder called ".maniok"
- As a starting point, download the [maniok documentation](https://github.com/danischuetz/maniok/blob/main/examples/maniokdocs.zip) (which is the documentation you are currently reading)
- Extract it to the .maniok folder
- Commit the changes
- View the documentation at [https://app.maniok.io](https://app.maniok.io), typing your repository url
- Set up for [editing](#editing)

## Editing

In order for the documentation to be rendered it needs to be exported to a workspace.json file inside the `.maniok` directory.

To automatically do that on save of any documentation file in VSCode, install the `emeraldwalk run-on-save` extension and configure it to run the structurizr-cli export command:

1. Install the structurizr-cli (e.g. using brew)
2. Install the VSCode run on save extension from `emeraldwalk`
3. Configure it accordingly ([example](https://github.com/danischuetz/maniok/blob/main/.vscode/settings.json))

Now, the workspace.json should be generated on save (see terminal output for `Run On Save` to catch any errors)

_That's a temporary workaround for the POC, this will be simplified ultimately through an own VSCode extension and/or docker image supporting auto-save and preview_

## Live Preview

For live preview, you can clone [https://github.com/danischuetz/maniok](https://github.com/danischuetz/maniok) locally and rename the .env.example file to .env and have the workspace path within the file point to your workspace.json.

Install the package and start a dev server:

```
$ npm i
$ npm run dev
```

The documentation should be available at <http://localhost:5173> **using `'local'` as the repository url**.
