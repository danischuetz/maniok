# Paperless-ngx Overview

![System Context](embed:paperless-system-context)

Paperless-ngx is a document management repository that combines a Django backend in `src/`, an Angular frontend in `src-ui/`, and Docker packaging in `docker/` to turn scanned or uploaded files into a searchable archive.

## Purpose

The repository implements document ingestion, OCR and parsing, metadata extraction, full-text search, workflows, sharing, user management, and optional AI-assisted suggestions. It also includes operational assets for local development, container image builds, and documented deployment variants.

## Main Runtime And Build-Time Parts

- The Angular UI in `src-ui/` is built with pnpm and Angular CLI, then copied into `src/documents/static/frontend/` during the Docker build.
- The Django application in `src/` exposes REST endpoints, an OpenAPI schema, session and token authentication, and WebSocket status updates.
- Background execution is split across a Celery worker, a Celery beat scheduler, and a `document_consumer` management command, all supervised by s6 in the container image.
- Persistent data is split between relational metadata storage and filesystem-backed document storage.

## Important Integrations

- Redis is required for Celery and Django Channels.
- A relational database is required for metadata, with SQLite, PostgreSQL, and MariaDB represented in repository configuration.
- IMAP and OAuth-capable mail providers are optional inputs for automated mail ingestion.
- Apache Tika and Gotenberg are optional services for parsing and document conversion.
- OpenAI or Ollama can be configured for optional AI chat, suggestion, and indexing features.

## Deeper Documentation

- `docs/system.md` describes the repository as a software system and its major runtime boundaries.
- `docs/containers/backend.md` explains the backend container and its internal component split.
- `docs/containers/processing.md` focuses on task execution and ingestion processes.

![Container View](embed:paperless-containers)