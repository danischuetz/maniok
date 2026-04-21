# Voicebox Architecture Overview

![System Context](embed:voicebox-system-context)

## Repository Purpose

Voicebox is a local-first voice synthesis studio. The repository combines the desktop product, the browser-accessible UI, the Python backend, packaging scripts, and supporting sites used to publish documentation and the public landing page.

The runtime architecture is centered on a local FastAPI service that handles voice profile management, generation orchestration, model downloads, audio processing, and persistence. The main user experiences are delivered through a Tauri desktop shell and a browser-hosted web application.

## Key Responsibilities

- Capture and manage voice profiles and samples.
- Generate speech with multiple TTS engines and model sizes.
- Apply audio effects and manage generation versions.
- Persist local application data, history, and stories.
- Expose a REST API and OpenAPI schema for integration and UI reuse.

## Main Runtime And Build-Time Parts

- The desktop application is assembled from the shared React frontend and a Tauri host that launches or reuses the Python backend sidecar.
- The backend API is implemented in FastAPI and structured around route modules, service modules, engine backends, database models, and shared utilities.
- The browser web application reuses frontend code from the desktop app and talks to the same backend API over HTTP.
- SQLite stores local state in the Voicebox data directory.
- Docker builds the backend and browser frontend into a containerized deployment that serves the SPA alongside the API.

## Important Integrations

- Hugging Face supplies downloadable model artifacts referenced by the backend.
- GitHub Releases supplies desktop update metadata and release assets for the Tauri updater.

## Deeper Documentation

- The system/container view is in [system.md](system.md).
- The backend internals are summarized in [backend-api.md](backend-api.md).
- Source evidence is primarily in the repository root README, [backend/README.md](../../backend/README.md), the root [package.json](../../package.json), [Dockerfile](../../Dockerfile), and the Tauri and frontend entry points.