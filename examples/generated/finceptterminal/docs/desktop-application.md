# Native Desktop Application Components

![Component View](embed:fincept-terminal-desktop-components)

## Why a Component View Exists

A component view is justified for the native desktop application because the repository exposes stable, named subsystems rather than a flat codebase. The bootstrap sequence and source tree show clear long-lived boundaries for application startup, UI composition, domain services, evented data fan-out, trading, Python execution, storage, and AI/MCP integration.

## Component Responsibilities

### Application Shell

`src/app/main.cpp` and the application shell classes create the process, enforce single-instance behavior per profile, initialize shared services, prepare application paths, and open windows.

### Screen Workbench

`src/app/MainWindow.*`, `src/app/ScreenRouter.*`, and the large `src/screens` tree represent the user-facing workbench. These modules host the terminal UI and consume service results and DataHub updates.

### Domain Services

`src/services` contains the feature-specific service layer for markets, news, economics, agents, geopolitics, maritime, government data, relationship mapping, and other domains.

### DataHub

`src/datahub` provides the in-process pub/sub layer that reduces duplicate fetches and fans out the latest values to many consumers. The repository documents this design in `fincept-qt/DATAHUB_ARCHITECTURE.md`.

### Trading and Stream Engine

`src/trading` contains the unified trading facade, broker registry, exchange session handling, streaming, and order-management logic.

### Python Bridge

`src/python` provides Python environment setup and subprocess execution. This is the bridge between the C++ application and the Python script runtime.

### Local Storage Integration

`src/storage` contains SQLite databases, repositories, cache storage, migrations, and secure local persistence support.

### AI and MCP Integration

`src/ai_chat` and `src/mcp` provide the AI chat and MCP tool integration surface. The bootstrap path initializes MCP tools and the application can connect to model providers and external MCP servers through this boundary.

## Interaction Pattern

The dominant interaction pattern is: screens call domain services, services publish and subscribe through DataHub, services and trading modules persist through storage, and Python-backed operations are delegated to the Python bridge when analytics or connector scripts are required.
