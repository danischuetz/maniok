<script lang="ts">
    import type { SzrWorkspace, DiagramModel } from 'c4ke-lib'
    import { WorkspaceService, DiagramService } from 'c4ke-lib'
    import {
        Content,
        Diagram,
        Navigation,
        DiagramNavigation,
        ModeNavigation,
        NavigationProvider
    } from 'c4ke-lib'

    import type { LayoutProps } from './$types'

    let { data, children }: LayoutProps = $props()

    let workspace: SzrWorkspace = $derived(WorkspaceService.parse(data.workspaceJson))

    let diagrams: DiagramModel[] = $derived(DiagramService.parse(workspace))
    let selectedDiagram: DiagramModel | null = $derived(diagrams.length > 0 ? diagrams[0] : null)
</script>

<NavigationProvider>
    <div class="flex flex-col w-screen h-screen">
        <!-- <header class="flex flex-row lg:hidden">
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
    </header> -->
        <div class="w-screen h-screen flex flex-row app-container">
            <Navigation class="hidden lg:flex">
                <ModeNavigation />
                <DiagramNavigation
                    {diagrams}
                    bind:selectedDiagram
                    class="flex flex-col self-stretch"
                />
            </Navigation>
            <Content class="flex-1">
                <Diagram diagram={selectedDiagram} />
            </Content>
        </div>
    </div>
</NavigationProvider>

<!-- {@render children()} -->
