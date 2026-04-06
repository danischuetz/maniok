# Open Core

The core library provides logic and Svelte components to display C4 diagrams and documents parsed from workspace.json objects.

## Usage

### Diagrams - display and navigation

```
<script lang="ts">
    import { Diagram, DiagramNavigation, DiagramProvider, parseDiagrams } from 'diagramlib'
    import type { DiagramModel } from 'diagramlib'

    # workspace.json file contents
    const workspace: object = ...

    let diagrams: DiagramModel[] = $derived(parseDiagrams(workspace))
</script>

<DiagramProvider {diagrams}>
    <DiagramNavigation />
    <Diagram />
</DiagramProvider>

```

### Documents - display and navigation

```
<script lang="ts">
    import { Document, DocumentNavigation, DocumentProvider, parseDocument } from 'diagramlib'
    import type { DocumentModel } from 'diagramlib'

    # workspace.json file contents
    const workspace: object = ...

    let document: DocumentModel[] = $derived(parseDocument(workspace))
</script>

<DocumentProvider {document}>
    <DocumentNavigation />
    <Document />
</DocumentProvider>
```

## Architecture

### Notes

- Actual component layer (Svelte) ideally should not handle state or logic in any way

### Logic Layer

- Parse workspace.json to diagram model
- Parse workspace.json to document model
- Calculate layout for diagram model
- Navigation state handling for
    - diagrams
    - documents

### Component Layer

- Diagram
    - Draws nodes, edges and edge labels as defined in the DiagramModel
    - Triggers the calculation of DiagramModel layout
- DiagramNavigation
    - Triggers selection of the current diagram
- Document
    - Renders the markdown document according to the current navigation state
- DocumentNavigation
    - Triggers selected section or heading within the document

### Style Layer
