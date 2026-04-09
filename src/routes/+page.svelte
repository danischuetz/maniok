<script lang="ts">
    import type { RepositoryModel } from 'maniok-core'
    import {
        DocumentNavigation,
        NotificationService,
        BurgerMenu,
        RepositoryService,
        LightSwitch,
        Logo,
        UrlSelector
    } from 'maniok-core'
    import {
        DocumentationProvider,
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

    let repositoryUrl: string = $state('https://github.com/danischuetz/maniok')
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

        const encoded: string = RepositoryService.encode(repository)
        goto(`/${encoded}`)
    }
</script>

<DocumentationProvider structurizrWorkspaceJson={data.workspaceJson}>
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
                            <DocumentNavigation />
                        </div>
                    </Navigation>
                </BurgerMenu>
                <Logo class="h-8 fill-primary-500" />
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
                <DocumentNavigation />
            </Navigation>
            <Content class="flex-1 content">
                <DiagramView />
                <DocumentView />
                <DiagramFocusModal />
            </Content>
        </div>
    </div>
</DocumentationProvider>
