workspace {
    !docs docs/overview.md

    model {
        user = person "User" "Uploads, searches, reviews, and manages archived documents through the Paperless-ngx web interface."

        redis = softwareSystem "Redis" "Required broker and pub/sub backend used for Celery and Django Channels."
        database = softwareSystem "Relational Database" "SQLite, PostgreSQL, or MariaDB database configured for Paperless-ngx metadata."
        mailProvider = softwareSystem "Mail Provider" "Optional IMAP/OAuth-enabled email service used for incoming mail ingestion."
        tika = softwareSystem "Apache Tika" "Optional text extraction service for office documents and email parsing."
        gotenberg = softwareSystem "Gotenberg" "Optional document conversion service used alongside Tika."
        llmProvider = softwareSystem "LLM Provider" "Optional OpenAI or Ollama service used for chat, suggestions, and vector-based AI features."

        paperless = softwareSystem "Paperless-ngx" "Document management system that ingests, OCRs, classifies, stores, and serves searchable documents." {
            !docs docs/system.md

            ui = container "Web UI" "Angular single-page application from src-ui, compiled during the Docker build and served as static assets." "Angular 21, TypeScript"

            backend = container "Web Application" "Django ASGI application that serves the SPA shell, exposes REST and OpenAPI endpoints, handles authentication, and provides WebSocket status updates." "Python 3.12, Django, Django REST Framework, Channels, Granian" {
                !docs docs/containers/backend.md

                corePlatform = component "Core Platform" "Shared authentication, user management, configuration, URL routing, API versioning, and application settings." "paperless package"
                documentsDomain = component "Documents Domain" "Document APIs, workflows, search, metadata management, ingestion orchestration, and task definitions." "documents package"
                mailIntegration = component "Mail Integration" "Mail account APIs, OAuth callback handling, and IMAP ingestion logic that submits document consumption tasks." "paperless_mail package"
                aiServices = component "AI Services" "Optional AI classification, matching, chat, embeddings, and LLM index maintenance." "paperless_ai package"
            }

            worker = container "Background Processing" "Celery worker, Celery beat scheduler, and the document_consumer management process supervised by s6 inside the application image." "Python 3.12, Celery, Django management commands, s6-overlay" {
                !docs docs/containers/processing.md
            }

            storage = container "Document Storage" "Persistent filesystem locations for consumed files, stored originals, generated archive files, thumbnails, data, and exports." "Filesystem volumes"
        }

        user -> ui "Uses via browser"
        ui -> backend "Calls REST API and opens WebSocket connections"
        backend -> worker "Queues long-running document and maintenance jobs"
        backend -> database "Reads from and writes to metadata"
        backend -> redis "Uses channel layer and status integration"
        backend -> storage "Serves uploaded and archived files"
        backend -> mailProvider "Completes optional OAuth callback flows for mail accounts"
        backend -> llmProvider "Sends optional AI chat and suggestion requests"
        worker -> database "Reads from and writes to metadata"
        worker -> redis "Uses Celery broker and shared pub/sub infrastructure"
        worker -> storage "Reads from and writes to document files"
        worker -> mailProvider "Fetches messages from configured mail accounts"
        worker -> tika "Extracts text from supported formats when enabled"
        worker -> gotenberg "Converts documents to PDF when enabled"
        worker -> llmProvider "Builds optional AI-assisted suggestions and vector indexes"

        corePlatform -> documentsDomain "Routes shared API and configuration flows into document capabilities"
        corePlatform -> mailIntegration "Provides shared authentication and configuration context"
        documentsDomain -> aiServices "Invokes optional AI matching, suggestions, and chat"
        mailIntegration -> documentsDomain "Queues document consumption tasks for email attachments"
        ui -> corePlatform "Uses authentication, profile, settings, and administration APIs"
        ui -> documentsDomain "Uses document, search, workflow, and task APIs"
        ui -> mailIntegration "Uses mail account, rule, and processed-mail APIs"
    }

    views {
        systemContext paperless "paperless-system-context" {
            include *
            autoLayout lr
        }

        container paperless "paperless-containers" {
            include *
            autoLayout lr
        }

        component backend "paperless-backend-components" {
            include *
            autoLayout lr
        }
    }
}