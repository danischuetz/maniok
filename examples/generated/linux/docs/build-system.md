# Build and Configuration System

![Build Components](embed:linux-build-components)

The build and configuration system is the clearest internally structured container in this repository.

Its responsibilities are to select configuration options, derive generated headers and dependency metadata, and recursively descend into subsystem directories to assemble the requested outputs.

The main internal parts are:

- Kconfig definitions, starting at the top-level `Kconfig` and continuing through subsystem-specific `Kconfig` files.
- Kbuild rules, rooted in the top-level `Makefile` and `Kbuild`, which determine preparation steps and directory descent.
- Build scripts under `scripts/`, which provide generated-file helpers, dependency tracking, and supporting build logic.

This container produces three artifact families visible in the repository: the kernel image, loadable modules, and tools under `tools/`.
