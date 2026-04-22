# Code - OSS Overview

![System Context](embed:code-oss-system-context)

This repository is the open-source development home for Code - OSS, the source base used to build Visual Studio Code. It combines an Electron desktop application, a browser-based workbench, extension runtime infrastructure, remote server support, bundled first-party extensions, and a standalone Rust CLI.

Its primary purpose is to deliver the edit-build-debug experience described in the repository README while keeping the implementation layered. The attached project instructions describe the main source architecture as `base`, `platform`, `editor`, `workbench`, `code`, `server`, and `sessions`, with built-in extensions under `extensions`.

Key responsibilities in this repository:

- Boot the desktop application from Electron entry points in `src/main.ts` and `src/vs/code/electron-main/main.ts`.
- Assemble the renderer workbench in `src/vs/workbench/workbench.desktop.main.ts` from browser UI, services, and feature contributions.
- Run extensions in a separate Node.js extension host process from `src/vs/workbench/api/node/extensionHostProcess.ts`.
- Provide remote and web-serving behavior from `src/server-main.ts` and `src/vs/server/node/server.main.ts`.
- Ship and build first-party extensions from the `extensions` folder.
- Offer a standalone Rust CLI from the `cli` folder for launching the editor, serving web, and tunnel-related commands.

Main runtime and build-time parts:

- `src/` contains the product source, including Electron, workbench, extension-host, and server code.
- `extensions/` contains bundled extensions that are built and later loaded through the extension runtime.
- `cli/` contains the Rust command-line application.
- `build/` contains gulp tasks, compilation helpers, packaging logic, and CI-oriented build scripts.
- `scripts/` contains development launchers such as `scripts/code.sh`.
- `test/` and `src/vs/*/test/` contain unit and integration test infrastructure.

Important integrations visible in the repository include Electron for the desktop runtime, Node.js HTTP and WebSocket handling for remote access, built-in extension loading, dev tunnel dependencies, and product configuration that wires in services such as GitHub Copilot defaults through `product.json`.

Deeper documentation:

- [System Runtime](system.md)
- [Desktop Workbench](desktop-workbench.md)