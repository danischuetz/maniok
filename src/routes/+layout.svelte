<script lang="ts">
    import type { SzrWorkspace, DiagramModel } from 'c4ke-lib'
    import { WorkspaceService, DiagramService, MarkdownService, BurgerMenu } from 'c4ke-lib'
    import {
        NavigationProvider,
        Navigation,
        DiagramNavigation,
        ModeNavigation,
        Content,
        Diagram,
        Documentation
    } from 'c4ke-lib'

    import type { LayoutProps } from './$types'

    let { data, children }: LayoutProps = $props()

    let workspace: SzrWorkspace = $derived(WorkspaceService.parse(data.workspaceJson))

    let diagrams: DiagramModel[] = $derived(DiagramService.parse(workspace))
    let selectedDiagram: DiagramModel | null = $derived(diagrams.length > 0 ? diagrams[0] : null)
    let markdownHtml: string = $derived(
        MarkdownService.parseToHtml(workspace.documentation!.sections![0].content)
    )
</script>

<NavigationProvider>
    <div class="flex flex-col w-screen h-screen">
        <header class="flex flex-row lg:hidden">
            <BurgerMenu>
                <Navigation class="nav-container-burger">
                    <ModeNavigation />
                    <DiagramNavigation
                        {diagrams}
                        bind:selectedDiagram
                        class="flex flex-col self-stretch"
                    />
                </Navigation>
            </BurgerMenu>
        </header>
        <div class="w-screen h-screen flex flex-row app-container">
            <Navigation class="hidden lg:flex nav-container">
                <ModeNavigation />
                <DiagramNavigation
                    {diagrams}
                    bind:selectedDiagram
                    class="flex flex-col self-stretch"
                />
            </Navigation>
            <Content class="flex-1">
                <Diagram diagram={selectedDiagram} />
                <Documentation html={markdownHtml} />
            </Content>
        </div>
    </div>
</NavigationProvider>

<!-- {@render children()} -->
