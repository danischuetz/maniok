workspace {

    model {
        viewer = person "Viewer"
        editor = person "Editor"

        c4ke = softwareSystem "c4ke" "A software system to minimize friction when creating, maintaining and consuming technical software documentation" {
            !docs docs

            c4ke-webapp = container "c4ke-webapp" "A web application suited to consumers of technical software documentation" "SvelteKit"
            
            c4ke-dsl-exporter = container "dsl-exporter" "Exports structurizr documentation to a workspace.json object" "node.js" {
                java-wrapper = component "Java Wrapper" "Packages a java runtime with java code to make it usable as a node module" "node.js"
            }

            c4ke-lib = container "c4ke-lib" "Core logic processing workspace.json objects. Calculates diagram layouts and renders diagrams and written documentation with configurable styling" "node.js" {
                c4ke-lib-api = component "c4ke-lib API"
                layoutEngine = component "Layout Engine" "Calculates the layout of diagram elements according to the contents and relationships"
                documentPresenter = component "Document Presenter" "Renders documentation written in Markdown"
                documentNavigation = component "Document Navigation" "Allows users to navigate written documentation"
                diagramPresenter = component "Diagram Presenter" "Renders a diagram described by nodes, edges and edge lables"
                diagramNavigation = component "Diagram Navigation" "Allows users to navigate diagrams according to C4 hierarchies"
            }

            c4ke-preview = container "c4ke-preview" "VSCode Extension. Renders the documentation into a webview as it would be presented in the webapp" "node.js"
        }

        structurizr = softwareSystem "Structurizr" "Defines the Structurizr DSL and parses structurizr documentation to workspace objects" "Java" {
            structiurizr-export = container "Structurizr Export" "Exports documentation to workspace.json object" "Java"
            structurizrExtension = container "Structurizr Extension" "VSCode Extension. Provides syntax highlighting for the Structurizr DSL" "node.js"
        }

        github = softwareSystem "GitHub" {
            github-api = container "GitHub API"
            github-client-repo = container "Client Repository" "Contains a .c4ke documentation directory" "GitHub Repo"
        }

        # User interactions
        viewer -> c4ke-webapp "inspect and navigate documentation"

        editor -> structurizrExtension "check syntax"
        editor -> c4ke-preview "inspect rendered version"
        editor -> github-client-repo "push changes"

        # Internals
        c4ke-webapp -> github-api "retrieve .c4ke/workspace.json from client repo at given URL"
        c4ke-webapp -> c4ke-lib-api "Use components to present diagrams and documentation"

        c4ke-preview -> c4ke-lib-api "Use components to present diagrams and documentation"
        c4ke-lib-api -> layoutEngine "expose functionality"
        c4ke-lib-api -> documentPresenter "expose functionality"
        c4ke-lib-api -> documentNavigation "expose functionality"
        c4ke-lib-api -> diagramPresenter "expose functionality"
        c4ke-lib-api -> diagramNavigation "expose functionality"

        github-api -> github-client-repo "retrieve .c4ke/workspace.json"

    }

    views {
        systemContext c4ke {
            include *
            autoLayout
        }

        container c4ke {
            include *
            autoLayout
        }

        container github {
            include *
            autoLayout
        }

        container structurizr {
            include *
            autoLayout
        }

        component c4ke-lib {
            include *
            autoLayout
        }

        component c4ke-dsl-exporter {
            include *
            autoLayout
        }
    }
    
}