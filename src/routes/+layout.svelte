<script lang="ts">
    import {
        DiagramProvider,
        Diagram,
        type SzrWorkspace,
        DiagramService,
        type DiagramModel,
        DiagramNavigation
    } from 'c4ke-lib'
    import { WorkspaceService } from 'c4ke-lib'
    import type { LayoutProps } from './$types'

    let { data, children }: LayoutProps = $props()

    let workspace: SzrWorkspace = $derived(WorkspaceService.parse(data.workspaceJson))

    let diagrams: DiagramModel[] = $derived(DiagramService.parse(workspace))
</script>

<div class="w-screen h-screen flex flex-row app-container">
    <DiagramProvider {diagrams}>
        <DiagramNavigation />
        <Diagram class="flex-1" />
    </DiagramProvider>
</div>

<!-- {@render children()} -->
