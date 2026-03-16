workspace {

    model {
        viewer = person "Viewer"
        editor = person "Editor"

        c4ke = softwareSystem "c4ke" "A software system to minimize friction when creating, maintaining and consuming technical software documentation" {
            c4ke-webapp = container "c4ke-webapp" "A web application suited to consumers of technical software documentation" "Svelte"
            dsl-exporter = container "dsl-exporter" "Exports structurizr documentation to a workspace.json object" "Java"
            c4ke-preview = container "c4ke-preview" "Renders the a workspace.json object into a webview as it would be presented in the webapp" "node.js"
            c4ke-lib = container "c4ke-lib" "Core logic processing workspace.json objects. Calculates diagram layouts and renders diagrams and written documentation with configurable styling" "node.js"
        }

        github = softwareSystem "Github"
    }

    views {
        systemContext c4ke "SystemContext" {
            include *
            autoLayout
        }
    }
    
}