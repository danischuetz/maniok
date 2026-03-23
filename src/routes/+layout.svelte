<script lang="ts">
    import {
        DiagramProvider,
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
</script>

<div class="flex flex-col w-screen h-screen">
    <DiagramProvider {diagrams}>
        <header class="flex flex-row lg:hidden">
            <DiagramNavigationPopup class="self-center" />
        </header>
        <div class="w-screen h-screen flex flex-row app-container">
            <DiagramNavigation class="hidden lg:flex self-stretch" />
            <Diagram class="flex-1" />
        </div>
    </DiagramProvider>
</div>

<!-- {@render children()} -->
