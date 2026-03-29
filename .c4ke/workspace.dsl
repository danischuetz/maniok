workspace {
    !docs docs/introduction.md

    model {
        viewer = person "Viewer"
        editor = person "Editor"

        c4ke-core = softwareSystem "c4ke-core" "Open core of the c4ke documentation system" {
            !docs docs/opencore.md
            c4ke-lib = container "c4ke-lib" "Core logic and components to view and navigate documentation described by a Structurizr workspace object" "node.js" {
                c4ke-lib-api = component "API"
                
                c4ke-lib-diagram = component "Diagram" "Renders diagrams"
                c4ke-lib-diagramparser = component "Diagram Parser" "Creates array of diagrams from workspace object"
                c4ke-lib-diagramnavigation = component "Diagram Navigation" "Allows users to navigate diagrams"
                c4ke-lib-layoutEngine = component "Layout Engine" "Calculates the layout of diagram elements according to the contents and relationships"
                
                c4ke-lib-document = component "Document" "Renders documentation written in Markdown"
                c4ke-lib-documentparser = component "Workspace Parser" "Creates array of diagrams from workspace object"
                c4ke-lib-documentnavigation = component "Document Navigation" "Allows users to navigate written documentation"
            }

            c4ke-viewer = container "c4ke-viewer" "Provides all functionality to consume documentation of a single workspace. Can be hosted locally or used as a component." "SvelteKit"
        }

        # c4ke-app = softwareSystem "c4ke-app" "A software system to minimize friction when creating, maintaining and consuming technical software documentation" {
        #     c4ke-webapp = container "c4ke-webapp" "A web application for consumers of technical software documentation" "SvelteKit"
        #     c4ke-database = container "DB" "Database to store users, sessions, orgs, subscriptions, entitlements, etc..." "Supabase"
        #     c4ke-payment-system = container "Payment System" "Manages payments to enable subscriptions and entitlements" "Stripe"
        # } 

        c4ke-editing = softwareSystem "c4ke-editing" "Tooling for editing and previewing documentation" {
            c4ke-dsl-exporter = container "dsl-exporter" "Exports structurizr documentation to a workspace.json object" "node.js" {
                java-wrapper = component "Java Wrapper" "Packages a java runtime with java code to make it usable as a node module" "node.js"
            }
            c4ke-preview = container "c4ke-preview" "VSCode Extension. Renders the documentation into a webview as it would be presented in the webapp" "node.js"
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
        viewer -> c4ke-viewer "View documentation"

        # Internals
        c4ke-viewer -> c4ke-lib "Display diagram and document components"
        c4ke-viewer -> github-api "Fetch documentation from client repo"

        c4ke-lib-api -> c4ke-lib-diagram "expose component"
        c4ke-lib-api -> c4ke-lib-diagramparser "expose parser"
        c4ke-lib-api -> c4ke-lib-diagramnavigation "expose component"
        
        c4ke-lib-api -> c4ke-lib-document "expose component"
        c4ke-lib-api -> c4ke-lib-documentparser "expose parser"
        c4ke-lib-api -> c4ke-lib-documentnavigation "expose component"

        c4ke-lib-diagram -> c4ke-lib-layoutEngine "calculate layout"

        # External
        github-api -> github-client-repo "retrieve .c4ke/workspace.json"
    }

    views {
        systemContext c4ke-core {
            include *
            autoLayout
        }

        container c4ke-core "CoreContainerView" {
            include *
            autoLayout lr
        }

        container github "GitHubContainerView" {
            include *
            autoLayout
        }

        component c4ke-lib {
            include *
            autoLayout lr
        }
    }
}