<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import type { DocumentNodeModel } from '../../model/documentation/documentnode'

    interface Props {
        children: Snippet
        diagrams: DiagramModel[]
        documentRoot?: DocumentNodeModel
    }

    let { children, diagrams, documentRoot }: Props = $props()

    let navigationContext: NavigationContextModel = $state({
        mode: ModeEnum.Documentation,
        diagrams: [],
        documentRoot: undefined,
        selectedDiagram: undefined,
        selectedDocumentNode: undefined,
        content: undefined,
        activeHeadingId: undefined,
        diagramFocusId: undefined
    })

    setContext('navigationContext', navigationContext)

    $effect(() => {
        navigationContext.diagrams = diagrams
        navigationContext.documentRoot = documentRoot
        navigationContext.selectedDiagram = diagrams.length > 0 ? diagrams[0] : undefined
        navigationContext.selectedDocumentNode = documentRoot
        navigationContext.content = documentRoot ? documentRoot.documentation : undefined
    })
</script>

{@render children()}
