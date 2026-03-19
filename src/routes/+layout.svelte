<script lang="ts">
    import {
        DiagramProvider,
        Diagram,
        type SzrWorkspace,
        DiagramService,
        type DiagramModel
    } from 'c4ke-lib'
    import { WorkspaceService } from 'c4ke-lib'
    import type { LayoutProps } from './$types'

    let { data, children }: LayoutProps = $props()

    let workspace: SzrWorkspace = $derived(WorkspaceService.parse(data.workspaceJson))

    let diagrams: DiagramModel[] = $derived(DiagramService.parse(workspace))
</script>

<DiagramProvider {diagrams}>
    <Diagram class="w-screen h-screen" />
</DiagramProvider>

<!-- {@render children()} -->
