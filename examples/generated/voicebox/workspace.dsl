workspace {
    !docs docs/overview.md

    model {
        user = person "User" "Creates voice profiles, generates speech, applies effects, and manages projects locally."
        huggingFace = softwareSystem "Hugging Face" "Hosts downloadable model artifacts used by the backend."
        githubReleases = softwareSystem "GitHub Releases" "Hosts signed desktop update metadata and release artifacts."

        voicebox = softwareSystem "Voicebox" "Local-first voice synthesis studio for cloning voices, generating speech, applying effects, and composing multi-voice projects." {
            !docs docs/system.md

            desktopApp = container "Desktop Application" "Tauri desktop shell that packages the React UI and starts or reuses the local backend sidecar." "Tauri 2, Rust, React, TypeScript" {
                description "Packaged desktop experience for local-first Voicebox usage."
                technology "Tauri 2, Rust, React, TypeScript"
            }

            webApp = container "Web Application" "Browser-hosted React application that reuses the shared frontend code and talks to the backend over HTTP." "React, TypeScript, Vite" {
                description "Browser delivery surface for the Voicebox interface."
                technology "React, TypeScript, Vite"
            }

            backendApi = container "Backend API" "FastAPI server that exposes REST endpoints, orchestrates generation jobs, manages models, and serves generated assets." "Python, FastAPI, Uvicorn" {
                !docs docs/backend-api.md

                routeLayer = component "Route Layer" "Registers domain routers and keeps HTTP handlers thin by validating input and delegating work." "FastAPI routers"
                serviceLayer = component "Service Layer" "Implements generation orchestration, queueing, CRUD workflows, model management, and task coordination." "Python services"
                backendAdapters = component "Engine Adapter Layer" "Abstracts TTS and STT engines behind shared backend protocols and model registries." "Python protocols and engine adapters"
                persistenceLayer = component "Persistence Layer" "Stores profiles, generations, stories, tasks, and migrations in the local data directory." "SQLAlchemy, SQLite"
            }

            localDatabase = container "Local Database" "Stores application state, profiles, generations, stories, and task metadata in the user's data directory." "SQLite"
        }

        user -> voicebox "Uses"
        user -> desktopApp "Uses for local desktop workflows"
        user -> webApp "Uses in a browser"
        desktopApp -> backendApi "Starts and calls over HTTP"
        desktopApp -> githubReleases "Checks for signed application updates"
        webApp -> backendApi "Calls over HTTP"
        backendApi -> localDatabase "Reads from and writes to"
        backendApi -> huggingFace "Downloads model artifacts from"

        routeLayer -> serviceLayer "Delegates requests to"
        serviceLayer -> backendAdapters "Loads models and runs inference through"
        serviceLayer -> persistenceLayer "Persists and queries state through"
        persistenceLayer -> localDatabase "Reads from and writes to"
    }

    views {
        systemContext voicebox "voicebox-system-context" {
            include *
            autoLayout lr
        }

        container voicebox "voicebox-containers" {
            include *
            autoLayout lr
        }

        component backendApi "voicebox-backend-components" {
            include *
            autoLayout lr
        }
    }
}