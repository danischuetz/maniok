<script lang="ts">
    import { createToaster } from '@skeletonlabs/skeleton-svelte'
    import type { SzrWorkspace, DiagramModel, DocumentNode } from 'c4ke-lib'
    import {
        WorkspaceService,
        DiagramService,
        MarkdownService,
        BurgerMenu,
        DocumentNavigation,
        DocumentService
    } from 'c4ke-lib'
    import {
        NavigationProvider,
        Navigation,
        DiagramNavigation,
        ModeNavigation,
        Content,
        Diagram,
        Documentation,
        Toaster
    } from 'c4ke-lib'

    import type { LayoutProps } from './$types'

    let { data, children }: LayoutProps = $props()

    let toaster = createToaster()

    let workspace: SzrWorkspace | undefined = $derived.by(() => {
        try {
            return WorkspaceService.parse(data.workspaceJson)
        } catch (error) {
            toaster.error({
                title: 'Failed to load workspace',
                description: error instanceof Error ? error.message : 'An unknown error occurred'
            })
            return undefined
        }
    })

    let diagrams: DiagramModel[] = $derived.by(() => {
        if (!workspace) return []

        try {
            return DiagramService.parse(workspace)
        } catch (error) {
            toaster.error({
                title: 'Failed to parse diagrams',
                description: error instanceof Error ? error.message : 'An unknown error occurred'
            })
            return []
        }
    })

    let documentRoot: DocumentNode | null = $derived.by(() => {
        if (!workspace) return null

        try {
            return DocumentService.generateDocumentTree(workspace)
        } catch (error) {
            toaster.error({
                title: 'Failed to generate document tree',
                description: error instanceof Error ? error.message : 'An unknown error occurred'
            })
            return null
        }
    })

    let selectedDiagram: DiagramModel | null = $derived(diagrams.length > 0 ? diagrams[0] : null)

    let markdownHtml: string = $derived(
        workspace ? MarkdownService.parseToHtml(workspace.documentation!.sections![0].content) : ''
    )
</script>

{#snippet navElements()}
    <ModeNavigation />
    <DiagramNavigation {diagrams} bind:selectedDiagram class="flex flex-col self-stretch" />
    {#if documentRoot}
        <DocumentNavigation {documentRoot} />
    {/if}
{/snippet}

<NavigationProvider>
    <div class="flex flex-col w-screen h-screen">
        <header class="flex flex-row lg:hidden">
            <BurgerMenu>
                <Navigation class="nav-container-burger">
                    {@render navElements()}
                </Navigation>
            </BurgerMenu>
        </header>
        <div class="w-screen h-screen flex flex-row app-container">
            <Navigation class="hidden lg:flex nav-container">
                {@render navElements()}
            </Navigation>
            <Content class="flex-1">
                <Diagram diagram={selectedDiagram} />
                <Documentation html={markdownHtml} />
            </Content>
        </div>
    </div>
</NavigationProvider>

<Toaster {toaster} />
<!-- {@render children()} -->
