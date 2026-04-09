<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import { ModeEnum, type NavigationContextModel } from '../model/navigation/navigationcontext'
    import type { DiagramModel } from '../model/diagram/diagrammodel'
    import type { DocumentNodeModel } from '../model/documentation/documentnode'
    import type { SzrWorkspace } from '../model/szr/szrworkspace'
    import { WorkspaceService } from '../service/workspaceservice'
    import { NotificationService } from '../service/notificationservice'
    import { DiagramService } from '../service/diagramservice'
    import { DocumentService } from '../service/documentservice'

    interface Props {
        children: Snippet
        structurizrWorkspaceJson: string
    }

    let { children, structurizrWorkspaceJson }: Props = $props()

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

    let workspace: SzrWorkspace | undefined = $derived.by(() => {
        try {
            return WorkspaceService.parse(structurizrWorkspaceJson)
        } catch (error) {
            NotificationService.notifyError('Failed to load workspace', error)
            return undefined
        }
    })

    let diagrams: DiagramModel[] = $derived.by(() => {
        if (!workspace) return []

        try {
            return DiagramService.parse(workspace)
        } catch (error) {
            NotificationService.notifyError('Failed to parse diagrams', error)
            return []
        }
    })

    let documentRoot: DocumentNodeModel | undefined = $derived.by(() => {
        if (!workspace) return undefined

        try {
            return DocumentService.generateDocumentTree(workspace)
        } catch (error) {
            NotificationService.notifyError('Failed to generate document tree', error)
            return undefined
        }
    })

    $effect(() => {
        navigationContext.diagrams = diagrams
        navigationContext.documentRoot = documentRoot
        navigationContext.selectedDiagram = diagrams.length > 0 ? diagrams[0] : undefined
        navigationContext.selectedDocumentNode = documentRoot
        navigationContext.content = documentRoot ? documentRoot.documentation : undefined
    })
</script>

{@render children()}
