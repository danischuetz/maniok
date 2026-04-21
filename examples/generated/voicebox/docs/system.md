# Voicebox System And Containers

![Containers](embed:voicebox-containers)

## System Scope

This model focuses on the product runtime that the repository actively ships: the desktop application, the browser-hosted web application, the FastAPI backend, and the local SQLite store. Supporting sites under `landing/` and `docs/` are part of the monorepo, but they are not part of the core voice generation runtime and are therefore left out of the C4 model to keep it precise.

## Containers

### Desktop Application

The desktop container is built with Tauri and packages the shared React UI. The Rust host code starts or reuses the bundled `voicebox-server` sidecar, checks the local API health endpoint, and integrates desktop-specific capabilities such as updater handling and OS audio features.

### Web Application

The browser container is built with Vite and imports the shared application code from `app/src`. This keeps the product UI largely aligned across desktop and browser delivery modes while switching platform bindings.

### Backend API

The backend container is the main runtime engine. It exposes REST routes, coordinates background generation work, manages model downloads and engine loading, and mounts the built frontend in Docker/web deployments.

### Local Database

SQLite persists profiles, generations, stories, versions, and task-related metadata in the local Voicebox data directory. The backend initializes the schema on startup and treats the database as part of the local-first runtime.

## Deployment Notes From Repository Evidence

- Root `package.json` defines workspace-level development and build commands.
- `tauri.conf.json` packages the frontend and external backend binary for desktop distribution.
- `Dockerfile` builds the browser frontend and Python backend into a single runtime image.
- `docker-compose.yml` exposes the API on port `17493` and persists user data and model cache via volumes.