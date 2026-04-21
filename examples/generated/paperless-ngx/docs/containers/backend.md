# Backend Container

![Backend Components](embed:paperless-backend-components)

The web application container is the main request-handling runtime. It is backed by Django, served through Granian in ASGI mode, and exposes REST endpoints, schema endpoints, authentication flows, and WebSocket endpoints.

## Component Split

- Core Platform: code in the `paperless` package provides shared settings, URL routing, authentication, user and group APIs, static entry views, and cross-cutting configuration.
- Documents Domain: code in the `documents` package owns the largest feature area, including document CRUD, search, workflows, bulk operations, task definitions, and ingestion orchestration.
- Mail Integration: code in `paperless_mail` exposes mail account and rule APIs, OAuth callback handling, and the logic that submits document consumption work for fetched attachments.
- AI Services: code in `paperless_ai` adds optional chat, vector indexing, metadata suggestions, and model-provider integration.

## Evidence

- `src/paperless/urls.py` registers routes from `documents.views`, `paperless.views`, and `paperless_mail.views`.
- `src/paperless/views.py` covers application configuration, profile, token, and administration endpoints.
- `src/documents/views.py` contains document APIs, search, bulk actions, system status, and AI chat streaming.
- `src/paperless/settings/__init__.py` wires REST framework, OpenAPI generation, Channels, and static file serving.