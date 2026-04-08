<script lang="ts">
    import type {
        SzrWorkspace,
        DiagramModel,
        DocumentNodeModel,
        DocumentContentModel
    } from 'maniok-core'
    import {
        WorkspaceService,
        DiagramService,
        DocumentNavigation,
        NotificationService,
        BurgerMenu,
        DocumentService,
        LightSwitch,
        Logo
    } from 'maniok-core'
    import {
        NavigationProvider,
        Navigation,
        DiagramNavigation,
        ModeNavigation,
        Content,
        DiagramView,
        DiagramFocusModal,
        DocumentView
    } from 'maniok-core'

    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    let workspace: SzrWorkspace | undefined = $derived.by(() => {
        try {
            return WorkspaceService.parse(data.workspaceJson)
        } catch (error) {
            NotificationService.notifyError({
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
            NotificationService.notifyError({
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
            NotificationService.notifyError({
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
    <div class="flex flex-col w-screen h-screen app overflow-hidden">
        <!-- Title Bar -->
        <header class="flex justify-between items-center w-full p-4 titlebar">
            <div class="flex items-center gap-4">
                <BurgerMenu class="p-0 lg:hidden">
                    <Navigation class="navigation-burger">
                        {@render navElements()}
                    </Navigation>
                </BurgerMenu>
                <Logo class="h-8 fill-primary-500" />
            </div>
            <LightSwitch class="size-8 stroke-1" />
        </header>

        <!-- Body -->
        <div class="w-full h-full flex flex-row overflow-hidden">
            <Navigation class="hidden lg:flex navigation">
                {@render navElements()}
            </Navigation>
            <Content class="flex-1 content">
                <DiagramView diagram={selectedDiagram} />
                <DocumentView html={content?.html} {diagrams} />
                <DiagramFocusModal {diagrams} />
            </Content>
        </div>
    </div>
</NavigationProvider>
