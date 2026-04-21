# Fincept Terminal System and Containers

![Container View](embed:fincept-terminal-containers)

## System Scope

The repository supports one primary software system: Fincept Terminal. It is delivered as a native desktop product and built from the `fincept-qt` CMake project.

The root of the repository contains release, packaging, and automation material, but the deployable application logic is concentrated in `fincept-qt`.

## Containers

### Native Desktop Application

This is the main executable target created by the CMake build. It owns the user interface, service composition, DataHub lifecycle, trading integrations, AI and MCP setup, and orchestration of the Python subprocess layer.

The evidence is strongest in `fincept-qt/src/app/main.cpp`, `fincept-qt/CMakeLists.txt`, and the module layout under `fincept-qt/src`.

### Python Analytics Scripts

The repository contains a large Python script collection under `fincept-qt/scripts`. The C++ application does not embed this logic directly in-process; instead, it resolves Python and launches scripts on demand through the `src/python` bridge.

This is a distinct runtime boundary even though it is distributed with the desktop application, because it executes separately and is used as a reusable analytics and connector layer.

### Local SQLite Store

Local persistence is handled by SQLite databases, migrations, and repositories under `fincept-qt/src/storage`. The bootstrap sequence in `main.cpp` also performs local path setup, migration handling, and database lifecycle work.

## External Dependencies

The container model includes only the external systems that are consistently evidenced by the repository:

- Market and research data providers.
- Broker and exchange platforms.
- LLM providers.
- External MCP servers.

The repository references many specific providers, but the architecture model keeps them grouped because the codebase presents them as integration families rather than separately deployable in-repo systems.

## Build and Packaging Notes

The CMake configuration pins compiler and Qt versions and defines platform-specific presets for Windows, Linux, and macOS. Packaging assets under `fincept-qt/packaging` and the root Dockerfile support distribution and build automation, but they do not introduce separate application containers within the product runtime.
