# FileBrowser Quantum

![Container View](embed:fbq-containers)

FileBrowser Quantum is delivered as a backend-led web application. The Go runtime owns startup, configuration loading, authentication, HTTP routing, WebDAV support, preview generation, and indexing. The frontend is a separately built SPA that is served by the backend at runtime.

Repository evidence for this split includes:

- `backend/main.go`, which starts the CLI and server runtime.
- `backend/cmd/root.go`, which initializes configuration, databases, indexing, preview generation, and the HTTP server.
- `frontend/package.json` and `frontend/vite.config.ts`, which show the Vite-based frontend build and the copy into backend asset directories.
- `makefile`, which builds frontend and backend separately and combines them for local and Docker execution.

The system has a small set of explicit external dependencies in the repository:

- Configured filesystem sources that hold the managed content.
- OIDC and LDAP identity systems used when those auth methods are enabled.
- OnlyOffice Document Server for browser-based document editing.

The design is intentionally backend-centric. The SPA handles presentation and client-side navigation, while the backend remains the single integration point for storage, authentication, search, previews, and external services.