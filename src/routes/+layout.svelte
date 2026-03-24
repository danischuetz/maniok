<script lang="ts">
    import {
        Diagram,
        type SzrWorkspace,
        DiagramService,
        type DiagramModel,
        DiagramNavigation,
        BurgerMenu,
        ModeNavigation
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
        <BurgerMenu>
            <nav class="nav-container">
                <ModeNavigation />
                <DiagramNavigation
                    {diagrams}
                    bind:selectedDiagram
                    class="flex flex-col self-stretch"
                />
            </nav>
        </BurgerMenu>
    </header>
    <div class="w-screen h-screen flex flex-row app-container">
        <nav class="nav-container hidden lg:flex">
            <ModeNavigation />
            <DiagramNavigation {diagrams} bind:selectedDiagram class="flex flex-col self-stretch" />
        </nav>
        <Diagram diagram={selectedDiagram} class="flex-1" />
    </div>
</div>

<!-- {@render children()} -->
