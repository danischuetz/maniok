# Backend Application

![Backend Components](embed:fbq-backend-components)

The backend application is the main runtime unit in this repository. It is compiled from the Go module in `backend` and is responsible for both serving the product and coordinating the supporting services behind it.

The main internal responsibilities visible in the code are:

- The HTTP and WebDAV interface in `backend/http`, including API endpoints, public share routes, SSE endpoints, Swagger, and static asset delivery.
- Authentication and access control in `backend/auth` and HTTP middleware, covering password login, API tokens, OIDC, LDAP, proxy auth, and permission enforcement.
- Content and preview services in `backend/indexing`, `backend/preview`, and `backend/ffmpeg`, covering indexed search, scanner scheduling, metadata lookup, and thumbnail or preview generation.
- Persistence in `backend/database`, which initializes local storage and exposes stores for users, shares, access rules, settings, and indexing metadata.

Startup in `backend/cmd/root.go` shows the runtime flow clearly: load settings, initialize persistent storage, initialize indexing, start preview generation, initialize icons and manifest assets, and finally start the HTTP server.

The backend also mediates optional integrations. OIDC and LDAP are invoked from auth-related HTTP flows, and OnlyOffice callbacks and editor configuration are exposed through office-specific endpoints.