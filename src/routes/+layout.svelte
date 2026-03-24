<script lang="ts">
    import {
        Diagram,
        type SzrWorkspace,
        DiagramService,
        type DiagramModel,
        DiagramNavigation,
        DiagramNavigationPopup
    } from 'c4ke-lib'
    import { WorkspaceService } from 'c4ke-lib'
    import type { LayoutProps } from './$types'

    let { data, children }: LayoutProps = $props()

    let workspace: SzrWorkspace = $derived(WorkspaceService.parse(data.workspaceJson))

    let diagrams: DiagramModel[] = $derived(DiagramService.parse(workspace))
    let selectedDiagram: DiagramModel | null = $derived(diagrams.length > 0 ? diagrams[0] : null)
</script>

<div class="flex flex-col w-screen h-screen">
    <header class="flex flex-row lg:hidden">
        <DiagramNavigationPopup {diagrams} bind:selectedDiagram class="self-center" />
    </header>
    <div class="w-screen h-screen flex flex-row app-container">
        <DiagramNavigation {diagrams} bind:selectedDiagram class="hidden lg:flex self-stretch" />
        <Diagram diagram={selectedDiagram} class="flex-1" />
    </div>
</div>

<!-- {@render children()} -->
