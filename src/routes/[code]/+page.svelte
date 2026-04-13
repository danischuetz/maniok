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

    let repositoryUrl: string = $derived.by(() =>
        data.repository ? RepositoryService.toUrl(data.repository) : ''
    )

    async function onRepositoryUrlConfirmation() {
        if (!repositoryUrl) return
        if (repositoryUrl === 'local') {
            goto(`/local`)
            return
        }

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

    let onNavigation: () => void = $state(() => {})
</script>

<DocumentationProvider structurizrWorkspaceJson={data.workspaceJson}>
    <div class="flex flex-col w-screen h-screen app overflow-hidden">
        <!-- Title Bar -->
        <header class="flex justify-between items-center p-4 titlebar gap-4 overflow-hidden">
            <div class="flex items-center gap-4">
                <BurgerMenu class="p-0 lg:hidden" bind:onNavigation>
                    <Navigation class="navigation-burger min-w-0 w-full" {onNavigation}>
                        <ModeNavigation />
                        <div class="flex flex-col min-w-0">
                            <UrlSelector
                                class="m-2 h-8"
                                bind:repositoryUrl
                                onConfirmation={onRepositoryUrlConfirmation}
                            />
                            <DiagramNavigation class="flex flex-col" />
                            <DocumentNavigation />
                        </div>
                    </Navigation>
                </BurgerMenu>
                <button onclick={() => goto(`/`)} class="flex items-center">
                    <Logo class="h-10 fill-primary-500" />
                </button>
            </div>
            <UrlSelector
                class="flex-1 max-w-lg hidden lg:flex"
                bind:repositoryUrl
                onConfirmation={onRepositoryUrlConfirmation}
            />
            <LightSwitch class="size-8 stroke-1" />
        </header>

        <!-- Body -->
        <div class="flex flex-1 overflow-hidden">
            <Navigation class="hidden lg:flex navigation">
                <ModeNavigation />
                <DiagramNavigation class="flex flex-col self-stretch" />
                <DocumentNavigation />
            </Navigation>
            <Content class="flex-1 content overflow-y-auto">
                <DiagramView />
                <DocumentView />
                <DiagramFocusModal />
            </Content>
        </div>
    </div>
</DocumentationProvider>
