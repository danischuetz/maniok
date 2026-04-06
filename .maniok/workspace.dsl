workspace {
    !docs markdown/introduction.md

    model {
        consumer = person "Consumer"
        editor = person "Editor"

        core = softwareSystem "core" "Open core of the c4ke documentation system" {
            !docs markdown/opencore.md
            lib = container "lib" "Core logic and components to view and navigate documentation described by a Structurizr workspace object" "node.js" {
                lib-api = component "API"
                
                lib-diagram = component "Diagram" "Renders diagrams"
                lib-diagramparser = component "Diagram Parser" "Creates array of diagrams from workspace object"
                lib-diagramnavigation = component "Diagram Navigation" "Allows users to navigate diagrams"
                lib-layoutEngine = component "Layout Engine" "Calculates the layout of diagram elements according to the contents and relationships"
                
                lib-document = component "Document" "Renders documentation written in Markdown"
                lib-documentparser = component "Workspace Parser" "Creates array of diagrams from workspace object"
                lib-documentnavigation = component "Document Navigation" "Allows users to navigate written documentation"
            }

            viewer = container "viewer" "Provides all functionality to consume documentation of a single workspace. Can be hosted locally or used as a component." "SvelteKit"
        }

        # app = softwareSystem "app" "A software system to minimize friction when creating, maintaining and consuming technical software documentation" {
        #     webapp = container "webapp" "A web application for consumers of technical software documentation" "SvelteKit"
        #     database = container "DB" "Database to store users, sessions, orgs, subscriptions, entitlements, etc..." "Supabase"
        #     payment-system = container "Payment System" "Manages payments to enable subscriptions and entitlements" "Stripe"
        # } 

        editing = softwareSystem "editing" "Tooling for editing and previewing documentation" {
            dsl-exporter = container "dsl-exporter" "Exports structurizr documentation to a workspace.json object" "node.js" {
                java-wrapper = component "Java Wrapper" "Packages a java runtime with java code to make it usable as a node module" "node.js"
            }
            preview = container "preview" "VSCode Extension. Renders the documentation into a webview as it would be presented in the webapp" "node.js"
        }

        structurizr = softwareSystem "Structurizr" "Defines the Structurizr DSL and parses structurizr documentation to workspace objects" "Java" {
            structurizr-export = container "Structurizr Export" "Exports documentation to workspace.json object" "Java"
            structurizrExtension = container "Structurizr Extension" "VSCode Extension. Provides syntax highlighting for the Structurizr DSL" "node.js"
        }

        github = softwareSystem "GitHub" {
            github-api = container "GitHub API"
            github-client-repo = container "Client Repository" "Contains a .c4ke documentation directory" "GitHub Repo"
        }

        # Viewer interactions
        consumer -> viewer "View documentation"

        # Internals
        consumer -> lib "Display diagram and document components"
        consumer -> github-api "Fetch documentation from client repo"

        lib-api -> lib-diagram "expose component"
        lib-api -> lib-diagramparser "expose parser"
        lib-api -> lib-diagramnavigation "expose component"
        
        lib-api -> lib-document "expose component"
        lib-api -> lib-documentparser "expose parser"
        lib-api -> lib-documentnavigation "expose component"

        lib-diagram -> lib-layoutEngine "calculate layout"

        # External
        github-api -> github-client-repo "retrieve .c4ke/workspace.json"
    }

    views {
        systemContext core {
            include *
            autoLayout
        }

        container core "CoreContainerView" {
            include *
            autoLayout lr
        }

        container github "GitHubContainerView" {
            include *
            autoLayout
        }

        component lib {
            include *
            autoLayout lr
        }
    }
}