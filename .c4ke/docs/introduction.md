# c4ke

## What is it, now?

A git-native architecture-as-code solution which minimizes friction in creating and consuming technical documentation. It is based on an ODI (Outcome Driven Innovation) research on current pain points in the lifecycle of technical software documentation.

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

## Brainstorm

- Introduction
- Getting Started

- **Software System: c4ke-core**
- Overview
- Chapter 2
    - **Container: c4ke-lib**
    - Overview
    - Chapter 2

- **Software System: c4ke-webapp**
    - **Container: c4ke-database**
    - Overview
    - Chapter 2
