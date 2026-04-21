# Repository Overview

![System Context](embed:fbq-system-context)

This repository contains FileBrowser Quantum, a self-hosted web file management application. The codebase is split into a Go backend under `backend` and a Vue 3 frontend under `frontend`, with Docker assets and test scenarios under `_docker`.

Its primary purpose is to expose configured filesystem sources through a responsive web interface and API. The application supports file browsing, previews, indexed search, sharing, user administration, API tokens, and optional authentication and office integrations.

The main runtime and build-time parts are:

- A Go backend binary started from `backend/main.go` and orchestrated through `backend/cmd`.
- A Vue/Vite frontend built from `frontend` and copied into `backend/http/dist` and `backend/http/embed`.
- Local persistent storage for settings, users, shares, access rules, tokens, and index data.
- Configured file sources defined in YAML configuration and accessed through filesystem adapters.
- Optional integrations for OIDC, LDAP, WebDAV clients, Swagger API browsing, and OnlyOffice editing.

The repository evidence for this model comes from the root README, the makefile build targets, the Go module and frontend package configuration, the HTTP router, and integration-specific code in the backend.

Deeper documentation is available here:

- `docs/system.md` for the overall software system.
- `docs/containers/backend.md` for the main backend runtime responsibilities.
- `docs/containers/web-ui.md` for the browser client and frontend build role.