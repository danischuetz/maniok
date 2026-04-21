# Paperless-ngx System

![Container View](embed:paperless-containers)

Paperless-ngx is modeled here as a single software system because the repository ships one cohesive application image and one codebase, even though that image supervises several runtime processes.

## System Responsibilities

- Provide a browser-based document archive and administration experience.
- Accept files from direct uploads, watched consumption folders, and email ingestion.
- Persist document metadata and files, including generated archive artifacts.
- Run long-lived and scheduled processing such as OCR, classifier training, indexing, and mail polling.
- Integrate with optional external services for parsing, conversion, and AI features.

## Why These Containers Exist

- The web UI is a separately built Angular application with its own package manager, test tooling, and build pipeline.
- The web application is the primary HTTP and WebSocket entry point and owns authentication, APIs, and the SPA shell.
- Background processing is operationally distinct in the container image through dedicated s6 service definitions for worker, scheduler, and consumer roles.
- Document storage is persistent and separate from the relational metadata database in both Docker and runtime configuration.

## Repository Evidence

- `Dockerfile` builds the frontend, installs Python dependencies, and assembles the runtime image.
- `docker/rootfs/etc/s6-overlay/s6-rc.d/` defines supervised runtime services.
- `src/manage.py`, `src/paperless/asgi.py`, and `src/paperless/celery.py` define entry points.
- `docker/compose/` provides supported deployment combinations for Redis, databases, and optional Tika services.