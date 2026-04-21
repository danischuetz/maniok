# Web UI

![Container View](embed:fbq-containers)

The Web UI is a Vue 3 single-page application in `frontend`. It provides the browser experience for login, file browsing, settings, tools, public share access, and embedded navigation.

The repository shows a clear separation between frontend source and runtime hosting:

- `frontend/src/main.ts` creates the Vue application, installs router and i18n, and mounts the SPA.
- `frontend/src/router/index.ts` defines the main user-facing routes for login, files, tools, settings, and public share paths.
- `frontend/package.json` and `frontend/vite.config.ts` define the frontend build and its output behavior.
- The build script copies the compiled assets into `backend/http/dist` and `backend/http/embed`, which the Go backend serves.

This container does not own direct persistence or external integrations. Instead, it depends on backend endpoints for authentication state, file operations, settings, search, previews, share handling, and optional office integration setup.