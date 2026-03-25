# Introduction

C4ke minimizes the friction in creating, maintaining and consuming software documentation for developers.

- Create and maintain useful documentation quickly, simply and without compromising security
- Use your favorite IDE and existing AI-tooling to write good and complete documentation faster

It utilizes the Structurizr DSL (Domain Specific Language) and tooling to describe systems in diagrams and text using the C4 model for software system abstractions. Written documentation is edited in Markdown and can be associated with elements of the C4 models.

To create easy-to-read and well designed diagrams, the dagrejs library is used to layout C4 elements and groups logically, enabling xyflow to render diagram elements, labels and connections.

# Quick Start

For public repositories:

- In a repository root, create a folder called ".c4ke"
- Download the [zipped template](https://github.com/danischuetz/c4ke-webapp/templates/c4ke), which contains the documentation you are currently reading
- Extract it to the .c4ke folder
- Commit the changes
- Visit c4ke.io/github/\<your organization\>/\<your repository\>
- Et voila, your documentation is online!

# Current Restrictions

This is a very minimal MVP and only works for public GitHub repositories right now (Making the functionality available for private repositories is the very next step, see [Private Repositories](#private-repositories) ).

Besides that, the following restrictions currently apply:

- C4/Structurizr DSL only partially supported
- Support for GitHub hosted repositories only

## Private repositories

In addition to the steps in quick start:

- You/your org need to install the c4ke Github App for the repo's to be documented
    - This is very restricted and only needs read access to a single file in each repo: .c4ke/workspace.json
- Viewers of the documentation have to register/log in to c4ke.io and can then connect to their GitHub
  account which will allow them to access the documentation.

# Editing tips

## Describe your system

## Add written documentation

# Users and use cases

## Viewer

## Editor
