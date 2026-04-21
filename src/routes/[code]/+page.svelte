<script lang="ts">
    import {
        DocumentNavigation,
        BurgerMenu,
        RepositoryService,
        LightSwitch,
        Logo
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
    import { WorkspaceWatcher } from '../../lib/util/workspacewatcher'

    import LikeButton from '../../lib/components/likebutton.svelte'
    import UrlSelector from '../../lib/components/urlselector.svelte'

    let { data, params }: PageProps = $props()

    let repositoryUrl: string = $derived.by(() =>
        data.repository ? RepositoryService.toUrl(data.repository) : ''
    )

    let onNavigation: () => void = $state(() => {})
    let workspaceWatcher: WorkspaceWatcher = new WorkspaceWatcher()

    $effect(() => {
        if (params.code === 'local') {
            workspaceWatcher.startWatching()
        } else {
            workspaceWatcher.stopWatching()
        }
    })
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
                            <UrlSelector class="m-2 h-8" {repositoryUrl} />
                            <DiagramNavigation class="flex flex-col" />
                            <DocumentNavigation />
                        </div>
                    </Navigation>
                </BurgerMenu>
                <button onclick={() => goto(`/`)} class="flex items-center">
                    <Logo class="h-10 fill-primary-500" />
                </button>
            </div>
            <UrlSelector class="flex-1 max-w-lg hidden lg:flex" {repositoryUrl} />
            <div class="flex items-center gap-4">
                {#if repositoryUrl !== 'local'}
                    <LikeButton />
                {/if}
                <LightSwitch class="size-8 stroke-1" />
            </div>
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
