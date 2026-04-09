<script lang="ts">
    import type {
        SzrWorkspace,
        DiagramModel,
        DocumentNodeModel,
        DocumentContentModel,
        RepositoryModel
    } from 'maniok-core'
    import {
        WorkspaceService,
        DiagramService,
        DocumentNavigation,
        NotificationService,
        BurgerMenu,
        DocumentService,
        RepositoryService,
        LightSwitch,
        Logo,
        UrlSelector
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
    import { goto } from '$app/navigation'

    let { data }: PageProps = $props()

    let repositoryUrl: string = $derived.by(() =>
        data.repository ? RepositoryService.toUrl(data.repository) : ''
    )

    $effect(() => {
        if (!data.repository) {
            NotificationService.notifyError(
                'No repository found at URL',
                'Please enter a valid GitHub repository URL.'
            )
            goto(`/`)
        }
    })

    async function onRepositoryUrlConfirmation() {
        if (!repositoryUrl) return

        const repository: RepositoryModel | null =
            await RepositoryService.deriveFromUrl(repositoryUrl)
        if (!repository) {
            NotificationService.notifyError(
                'Invalid repository URL',
                new Error(`Could not derive repository from URL: ${repositoryUrl}`)
            )
            return
        }

        const code: string = RepositoryService.encode(repository)
        goto(`/${code}`)
    }

    let workspace: SzrWorkspace | undefined = $derived.by(() => {
        try {
            return WorkspaceService.parse(data.workspaceJson)
        } catch (error) {
            NotificationService.notifyError('Failed to load workspace', error)
            return undefined
        }
    })

    let diagrams: DiagramModel[] = $derived.by(() => {
        if (!workspace) return []

        try {
            return DiagramService.parse(workspace)
        } catch (error) {
            NotificationService.notifyError('Failed to parse diagrams', error)
            return []
        }
    })

    let documentRoot: DocumentNodeModel | undefined = $derived.by(() => {
        if (!workspace) return undefined

        try {
            return DocumentService.generateDocumentTree(workspace)
        } catch (error) {
            NotificationService.notifyError('Failed to generate document tree', error)
            return undefined
        }
    })
</script>

<NavigationProvider {diagrams} {documentRoot}>
    <div class="flex flex-col w-screen h-screen app overflow-hidden">
        <!-- Title Bar -->
        <header class="flex justify-between items-center w-full p-4 titlebar gap-4">
            <div class="flex items-center gap-4">
                <BurgerMenu class="p-0 lg:hidden">
                    <Navigation class="navigation-burger">
                        <ModeNavigation />
                        <DiagramNavigation class="flex flex-col self-stretch" />
                        <div class="flex flex-col">
                            <UrlSelector
                                class="m-2 h-8"
                                bind:repositoryUrl
                                onConfirmation={onRepositoryUrlConfirmation}
                            />
                            {#if documentRoot}
                                <DocumentNavigation />
                            {/if}
                        </div>
                    </Navigation>
                </BurgerMenu>
                <button onclick={() => goto(`/`)} class="flex items-center">
                    <Logo class="h-8 fill-primary-500" />
                </button>
            </div>
            <UrlSelector
                class="flex-1 max-w-lg h-8 hidden lg:flex"
                bind:repositoryUrl
                onConfirmation={onRepositoryUrlConfirmation}
            />
            <LightSwitch class="size-8 stroke-1" />
        </header>

        <!-- Body -->
        <div class="w-full h-full flex flex-row overflow-hidden">
            <Navigation class="hidden lg:flex navigation">
                <ModeNavigation />
                <DiagramNavigation class="flex flex-col self-stretch" />
                {#if documentRoot}
                    <DocumentNavigation />
                {/if}
            </Navigation>
            <Content class="flex-1 content">
                <DiagramView />
                <DocumentView />
                <DiagramFocusModal />
            </Content>
        </div>
    </div>
</NavigationProvider>
