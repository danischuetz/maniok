workspace {
    !docs docs/overview.md

    model {
        user = person "User" "Browses files, previews content, creates shares, and administers the application."

        sources = softwareSystem "Configured File Sources" "Directories and mounted filesystems exposed through FileBrowser Quantum."
        oidcProvider = softwareSystem "OIDC Provider" "External identity provider used for OpenID Connect login when enabled."
        ldapDirectory = softwareSystem "LDAP Directory" "External directory used for LDAP authentication when enabled."
        onlyOfficeServer = softwareSystem "OnlyOffice Document Server" "External document editing service used for browser-based office editing when configured."

        filebrowser = softwareSystem "FileBrowser Quantum" "Self-hosted web-based file manager for browsing, searching, previewing, sharing, and administering files." {
            !docs docs/system.md

            webUi = container "Web UI" "Vue single-page application for login, file browsing, tools, settings, and share flows." "Vue 3, TypeScript, Vue Router, Vite" {
                !docs docs/containers/web-ui.md
            }

            backendApp = container "Backend Application" "Go runtime that loads configuration, serves the SPA and APIs, handles authentication, indexes sources, and generates previews." "Go 1.25, net/http, embedded frontend assets" {
                !docs docs/containers/backend.md

                httpInterface = component "HTTP and WebDAV Interface" "Routes browser requests, API endpoints, public share endpoints, server-sent events, Swagger, and WebDAV access." "Go net/http"
                authAccess = component "Authentication and Access Control" "Authenticates users via password, OIDC, LDAP, proxy, and token flows and enforces permissions." "Go auth and HTTP middleware"
                contentServices = component "Content and Preview Services" "Indexes configured sources, serves search and metadata, and generates previews for media and documents." "Go indexing, preview, ffmpeg"
                persistenceLayer = component "Persistence Layer" "Persists settings, users, shares, tokens, access rules, and indexing metadata." "BoltDB/Storm and SQLite"
            }

            metadataStore = container "Metadata Store" "Local persistent storage for application state and file indexing metadata." "BoltDB/Storm and SQLite"
        }

        user -> filebrowser "Uses to manage files"
        user -> webUi "Uses in a web browser"
        webUi -> backendApp "Calls JSON API, SSE, and share endpoints"
        backendApp -> metadataStore "Reads and writes settings, users, shares, tokens, and index data"
        backendApp -> sources "Reads and writes managed files"
        backendApp -> oidcProvider "Delegates OIDC login to"
        backendApp -> ldapDirectory "Authenticates users against"
        backendApp -> onlyOfficeServer "Uses for office editing when configured"

        httpInterface -> authAccess "Uses for authentication and permission checks"
        httpInterface -> contentServices "Uses for file operations, search, previews, and metadata"
        httpInterface -> persistenceLayer "Uses for application state"
        httpInterface -> onlyOfficeServer "Coordinates editor configuration and callbacks"
        authAccess -> persistenceLayer "Loads users, shares, rules, and tokens"
        authAccess -> oidcProvider "Uses for OIDC sign-in"
        authAccess -> ldapDirectory "Uses for LDAP authentication"
        contentServices -> persistenceLayer "Reads and writes index metadata"
        contentServices -> sources "Reads files and directories"
        persistenceLayer -> metadataStore "Reads and writes"
    }

    views {
        systemContext filebrowser "fbq-system-context" {
            include *
            autoLayout lr
        }

        container filebrowser "fbq-containers" {
            include *
            autoLayout lr
        }

        component backendApp "fbq-backend-components" {
            include *
            autoLayout lr
        }
    }
}