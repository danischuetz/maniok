workspace {
    !docs markdown/introduction.md

    model {
        user = person "User"

        maniok = softwareSystem "Maniok" "The maniok documentation system" {
            core = container "Core" "Core logic and components to render and navigate written documentation and diagrams from a Structurizr workspace" "node.js" {
                core-diagramservice = component "Diagram Service" "Creates a diagram model tree from a Structurizr workspace"
                core-documentservice = component "Document Service" "Creates a document model tree from a Structurizr workspace"
                core-layoutservice = component "Diagram Layout Service" "Calculates a suitable layout for a layout model tree"
                core-markdownservice = component "Markdown Service" "Renders markdown content to html"
                core-notificationservice = component "Notification Service" "Enable notification registrations which should be shown to the user"
                core-workspaceservice = component "Workspace Service" "Creates a Structurizr workspace model from a Structurizr workspace JSON"

                core-components = component "Maniok Component Library" "Svelte Components to present diagrams, documents and navigation" "Svelte"
            }

            webapp = container "Maniok Webapp" "Renders the documentation for a selected public GitHub repository" "SvelteKit"
            editor = container "Maniok Editor" "Docker image to support live preview and export-on-save" "Docker"
        }

        structurizr = softwareSystem "Structurizr" "Defines the Structurizr DSL and parses Structurizr documentation to workspace objects" "Java" {
            structurizr-cli = container "Structurizr CLI" "Exports structurizr documentation to workspace.json object" "Java"
        }

        github = softwareSystem "GitHub" {
            github-client-repo = container "GitHub Client Repository" "Contains a .maniok documentation directory" "GitHub Repo"
        }

        # User interactions
        user -> webapp "View documentation"
        user -> editor "Edit & preview documentation"

        # Internals
        webapp -> core-diagramservice "Build diagram model tree"
        webapp -> core-documentservice "Build document model tree"
        webapp -> core-components "Render diagram & document models"
        webapp -> core-notificationservice "Show warnings, info, errors etc."
        webapp -> core-workspaceservice "Parse workspace JSON"

        webapp -> github-client-repo "Fetch documentation from client repo"

        core-components -> core-layoutservice "Calculate diagram layout"
        core-components -> core-markdownservice "Render Markdown"

        # External
        user -> github-client-repo "Push documentation changes"
    }

    views {
        systemContext maniok {
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

        component core {
            include *
            autoLayout lr
        }
    }
}