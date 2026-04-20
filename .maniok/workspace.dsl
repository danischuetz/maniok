workspace {
    !docs markdown/introduction.md

    model {
        user = person "User"

        maniok = softwareSystem "Maniok" "The maniok documentation system" {
            !docs markdown/manioksystem.md
            core = container "Core" "Core logic and components to render and navigate written documentation and diagrams from a Structurizr workspace" "node.js" {
                !docs markdown/maniokcore.md 
                core-diagramservice = component "Diagram Service" "Creates a diagram model tree from a Structurizr workspace"
                core-documentservice = component "Document Service" "Creates a document model tree from a Structurizr workspace"
                core-layoutservice = component "Diagram Layout Service" "Calculates a suitable layout for a layout model tree"
                core-markdownservice = component "Markdown Service" "Renders markdown content to html"
                core-notificationservice = component "Notification Service" "Enable notification registrations which should be shown to the user"
                core-workspaceservice = component "Workspace Service" "Creates a Structurizr workspace model from a Structurizr workspace JSON"
                core-repositoryservice = component "Repository Service" "Handles repository interactions and resource loading"

                core-documentationprovider = component "Documentation Provider" "Context for all documentation components working on a Structurizr workspace"
                core-components = component "Maniok Component Library" "Svelte Components to present diagrams, documents and navigation" "Svelte"
            }

            webapp = container "Maniok Webapp" "Renders the documentation for a selected public GitHub repository" "SvelteKit"
            editor = container "Maniok Editor" "Docker image to support live preview and export-on-save" "Docker"
        }

        structurizr = softwareSystem "Structurizr" "Defines the Structurizr DSL and parses Structurizr documentation to workspace objects" "Java" {
            structurizr-dsl = container "Structurizr DSL" "The Structurizr modelling language" "DSL"
            structurizr-docker = container "Structurizr Docker Image" "" "Docker"
        }

        github = softwareSystem "GitHub" {
            github-client-repo = container "GitHub Client Repository" "Contains a .maniok documentation directory" "GitHub Repo"
        }

        # User interactions
        user -> webapp "View documentation"
        user -> editor "Edit & preview documentation"
        user -> github-client-repo "Push documentation changes"
        user -> structurizr-dsl "Model systems and write documentation"

        # Internals
        core-documentationprovider -> core-diagramservice "Build diagram model tree"
        core-documentationprovider -> core-documentservice "Build document model tree"
        core-documentationprovider -> core-components "Render diagram & document models"
        core-documentationprovider -> core-notificationservice "Show warnings, info, errors etc."
        core-documentationprovider -> core-workspaceservice "Parse workspace JSON"
        core-documentationprovider -> core-repositoryservice "Load resources from git repositories"
        
        webapp -> github-client-repo "Fetch documentation from client repo"
        webapp -> core-documentationprovider "Initialize from workspace JSON"

        editor -> structurizr-docker "Run locally to parse workspace JSON on save and to provide live preview"

        core-components -> core-layoutservice "Calculate diagram layout"
        core-components -> core-markdownservice "Render Markdown"
    }

    views {
        systemContext maniok "SystemContextView" {
            include *
            autoLayout lr
        }

        container maniok "CoreContainerView" {
            include *
            autoLayout lr
        }

        container github "GitHubContainerView" {
            include *
            autoLayout lr
        }

        component core "CoreComponentView" {
            include *
            autoLayout lr
        }
    }
}