# Code - OSS Runtime Structure

![Runtime Containers](embed:code-oss-runtime-containers)

The repository produces multiple runtime executables and process boundaries rather than a single monolith.

The desktop entry path starts in `src/main.ts`, which configures Electron and imports `src/vs/code/electron-main/main.js`. The Electron main process then creates services such as configuration, lifecycle, files, logging, policy, tunnels, and protocol handling before starting the application bootstrap.

The renderer-side workbench is assembled in `src/vs/workbench/workbench.desktop.main.ts`. That module pulls together desktop browser code, service registrations, and many workbench contributions such as files, debug, remote, terminal, chat, tasks, and webview support.

The extension host runs as a separate Node.js process from `src/vs/workbench/api/node/extensionHostProcess.ts`. The code explicitly patches process behavior, sets compatibility guards, establishes IPC, and then initializes the extension host main runtime.

The remote server path starts in `src/server-main.ts`, which decides whether to spawn CLI behavior or an HTTP/WebSocket server. `src/vs/server/node/server.main.ts` sets up server data folders, built-in extension paths, and creates the remote extension host agent server.

The bundled extensions container is justified by the dedicated `extensions/` workspace with its own package manifest and build path. These extensions are part of the shipped product and are loaded through the extension runtime rather than being treated as ordinary source folders.

The Rust CLI in `cli/` is a separate executable with its own Cargo manifest and command modules. Its entry point in `cli/src/bin/code/main.rs` can launch the desktop editor and exposes commands for updates, web serving, agent host flows, and tunnels.

Build configuration evidence:

- Root `package.json` drives development watch tasks, compile checks, gulp builds, web builds, hygiene, and performance scripts.
- `build/gulpfile.ts` orchestrates client transpilation, typechecking, extension compilation, and watch tasks.
- `build/package.json` contains build-only dependencies and typecheck/test scripts for build infrastructure.

Service boundary evidence:

- The project instructions describe a layered architecture from `base` to `platform` to `editor` to `workbench`.
- The Electron main process uses service collection and instantiation patterns to register platform services.
- The workbench registers remote services such as the extension host starter instead of directly instantiating process-launch logic in UI code.