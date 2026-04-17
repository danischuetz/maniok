# Maniok

The git-native solution for C4 architecture documentation - like Docusaurus for architects, with C4 diagrams-as-code but without the setup overhead.

Maniok is an interactive webapp to inspect git-hosted Structurizr documentation. It renders C4 diagrams embedded in written documentation (Markdown) to create comprehensive technical documentation which can be easily maintained.

For an example, check out the [Maniok documentation](https://app.maniok.io/Z2l0aHViOmRhbmlzY2h1ZXR6L21hbmlvaw)!

<img style="border-radius:6px;" alt="Maniok webapp screenshot" src="docs/webapp-screenshot.png" width="500">

Maniok is strcutured as a SvelteKit webapp built around a Node + Svelte core package at `packages/maniok-core`.

## How to use it

Write [Structurizr](https://docs.structurizr.com/dsl) documentation and put it in a `.maniok` folder at the root of your repository for it to be accessible through the [Maniok webapp](https://app.maniok.io).

<span style="color: orange; font-style: italic;">Note: The webapp only works on public GitHub repositories currently. To test Maniok on private repositories you can run maniok on a local workspace following the editing instructions from the [docs](https://app.maniok.io/Z2l0aHViOmRhbmlzY2h1ZXR6L21hbmlvaw).</span>

## Current State & Restrictions

The project is at a very early stage (Proof-of-concept) and has a limited feature set. That is about to change (see [MVP](#mvp---v100)) but currently:

- It does currently work on **open source repositories only**
- Diagram layout doesn't work well in all cases and for uni-directional flows only
- Editing with auto-export has to be set up manually, see chapter [Editing](#editing) (It is planned to either provide a docker image or a VSCode extension for export/preview)
- Branch currently fixed to "HEAD"

# MVP - v1.0.0

Work on that milestone is in progress, [have a look](https://github.com/users/danischuetz/projects/3/views/2).

The goal of this MVP is to enable the use of Maniok in a professional context.

# Structurizr Support

## Model

| Feature                            | Supported |
| ---------------------------------- | --------- |
| `person`                           | ✅        |
| `softwareSystem`                   | ✅        |
| `container`                        | ✅        |
| `component`                        | ✅        |
| `archetypes`                       | ✅        |
| `group`                            | ❌        |
| `deploymentEnvironment`            | ❌        |
| `deploymentGroup`                  | ❌        |
| `deploymentNode`                   | ❌        |
| `infrastructureNode`               | ❌        |
| `softwareSystemInstance`           | ❌        |
| `containerInstance`                | ❌        |
| `instanceOf`                       | ❌        |
| `description`                      | ✅        |
| `technology`                       | ✅        |
| `instances`                        | ❌        |
| `perspectives`                     | ❌        |
| `!identifiers`                     | ✅        |
| `!impliedRelationships`            | ✅        |
| `!include`                         | ✅        |
| `!docs`                            | ✅        |
| `!adrs`                            | ❌        |
| `!element` / `!elements`           | ✅        |
| `!relationship` / `!relationships` | ✅        |

## Views

| Feature                               | Supported |
| ------------------------------------- | --------- |
| `systemLandscape` view                | ❌        |
| `systemContext` view                  | ✅        |
| `container` view                      | ✅        |
| `component` view                      | ✅        |
| `filtered` view                       | ✅        |
| `dynamic` view                        | ❌        |
| `deployment` view                     | ❌        |
| `custom` view                         | ❌        |
| `image` view                          | ❌        |
| `include` / `exclude` (elements)      | ✅        |
| `include` / `exclude` (relationships) | ✅        |
| `autoLayout`                          | ✅        |
| `default`                             | ❌        |
| `animation`                           | ❌        |
| `title`                               | ❌        |

## Styles & Themes

At least currently, it is not the plan to support custom styling. This is an opinionated decision to focus on providing good styling automatically. Support for Maniok (CSS) themes other than already supported dark & bright modes might be added in the future but those will not be related to Structurizr Themes.

# Editing & Dev Setup

To run locally, clone the repository and run:

```bash
npm i
npm run dev
```

Maniok should then be available on localhost:5173 supporting hot-reload for any source file changes.

To run Maniok on a local workspace in the filesystem, use 'local' as the repository URL. By default, 'local' points to the maniok documentation. This path can be changed editing the `.env.example` file and renaming it to `.env`.

# How to contribute

As we are just getting started with this community, most welcome contributions would be to create and participate in discussions around how to collaborate, new features and the current roadmap.

This will soon be extended, once first bug reports are coming in. Then we need to add:

- Bug Issue Template
- PR Template
