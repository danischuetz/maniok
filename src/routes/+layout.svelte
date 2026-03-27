<script lang="ts">
    import { createToaster } from '@skeletonlabs/skeleton-svelte'
    import type {
        SzrWorkspace,
        DiagramModel,
        DocumentNodeModel,
        DocumentContentModel
    } from 'c4ke-lib'
    import {
        WorkspaceService,
        DiagramService,
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
        DiagramView,
        DocumentView,
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

    let documentRoot: DocumentNodeModel | undefined = $derived.by(() => {
        if (!workspace) return undefined

        try {
            return DocumentService.generateDocumentTree(workspace)
        } catch (error) {
            toaster.error({
                title: 'Failed to generate document tree',
                description: error instanceof Error ? error.message : 'An unknown error occurred'
            })
            return undefined
        }
    })

    let selectedDiagram: DiagramModel | undefined = $derived(
        diagrams.length > 0 ? diagrams[0] : undefined
    )
    let selectedDocumentNode: DocumentNodeModel | undefined = $derived(documentRoot)

    let content: DocumentContentModel | undefined = $derived(
        selectedDocumentNode ? selectedDocumentNode.documentation : undefined
    )
</script>

{#snippet navElements()}
    <ModeNavigation />
    <DiagramNavigation {diagrams} bind:selectedDiagram class="flex flex-col self-stretch" />
    {#if documentRoot}
        <DocumentNavigation {documentRoot} bind:selectedDocumentNode />
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
                <DiagramView diagram={selectedDiagram} />
                <DocumentView html={content?.html} {diagrams} />
            </Content>
        </div>
    </div>
</NavigationProvider>

<Toaster {toaster} />
<!-- {@render children()} -->
