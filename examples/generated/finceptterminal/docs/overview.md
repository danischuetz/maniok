# Fincept Terminal Overview

![System Context](embed:fincept-terminal-system-context)

## Purpose

Fincept Terminal is a native desktop financial intelligence terminal. The repository centers on a single Qt-based application that combines market data access, research workflows, trading integrations, AI-assisted workflows, and local persistence in one installable product.

The strongest evidence is in the root README, the CMake build under `fincept-qt`, the application bootstrap in `src/app/main.cpp`, and the service-oriented source layout under `src/services`, `src/trading`, `src/datahub`, `src/python`, and `src/storage`.

## Key Responsibilities

- Render the interactive desktop terminal UI with Qt6 widgets and charts.
- Coordinate many feature-specific services for markets, news, economics, maritime, geopolitics, agents, and related domains.
- Run Python-based analytics and connector scripts as local subprocesses.
- Cache and persist local state through SQLite databases and repositories.
- Connect to external data providers, broker and exchange platforms, LLM providers, and optional MCP tool servers.

## Main Runtime and Build-Time Parts

The repository is organized around one main product runtime and its build assets.

- `fincept-qt` contains the actual product source, CMake project, presets, packaging assets, resources, Python scripts, and tests.
- `fincept-qt/src/app/main.cpp` bootstraps the application, initializes DataHub producers, prepares local paths and databases, configures Python setup, and wires core services.
- `fincept-qt/src/python` provides the bridge that launches Python scripts.
- `fincept-qt/src/storage` and `fincept-qt/src/storage/sqlite` provide repositories, migrations, cache storage, and local persistence.
- `fincept-qt/src/datahub` provides the in-process pub/sub data distribution layer described in `fincept-qt/DATAHUB_ARCHITECTURE.md`.
- `fincept-qt/CMakeLists.txt` and `fincept-qt/CMakePresets.json` define the cross-platform build and packaging flow for Windows, Linux, and macOS.

## Important Integrations

Repository evidence shows these integration categories clearly:

- Market, economic, news, and government data providers accessed from the C++ service layer and many Python scripts under `fincept-qt/scripts`.
- Broker, exchange, and prediction-market integrations under `fincept-qt/src/trading` and `fincept-qt/src/services/prediction`.
- LLM provider integrations through the AI chat and agent features in `fincept-qt/src/ai_chat`.
- MCP integration through `fincept-qt/src/mcp` and the README's workflow tooling references.

## Where To Go Deeper

- See the system/container breakdown in `docs/system.md`.
- See the internal desktop application breakdown in `docs/desktop-application.md`.
- For repository-native technical detail, the most useful upstream sources are `README.md`, `docs/ARCHITECTURE.md`, `fincept-qt/DATAHUB_ARCHITECTURE.md`, and `fincept-qt/CMakeLists.txt`.
