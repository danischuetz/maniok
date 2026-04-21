<script lang="ts">
    import {
        DocumentNavigation,
        BurgerMenu,
        RepositoryService,
        LightSwitch,
        Logo,
        type RepositoryModel
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

    import { goto } from '$app/navigation'
    import LikeButton from './components/likebutton.svelte'
    import UrlSelector from './components/urlselector.svelte'
    import { type CapabilitiesModel } from './model/capabilities'
    import type { Snippet } from 'svelte'

    interface Props {
        capabilities?: CapabilitiesModel
        repository?: RepositoryModel
        workspaceJson: string
        customComponent?: Snippet
    }

    export const defaultCapabilities: CapabilitiesModel = {
        urlSelection: true,
        likeButton: true
    }

    let {
        capabilities = defaultCapabilities,
        repository,
        workspaceJson,
        customComponent
    }: Props = $props()

    let repositoryUrl: string = $derived.by(() =>
        repository ? RepositoryService.toUrl(repository) : ''
    )

    let onNavigation: () => void = $state(() => {})
</script>

{#snippet mobileMenu()}
    <BurgerMenu class="p-0 lg:hidden" bind:onNavigation>
        <Navigation class="navigation-burger min-w-0 w-full" {onNavigation}>
            <ModeNavigation />
            <div class="flex flex-col min-w-0">
                {#if capabilities.urlSelection}
                    <UrlSelector class="m-2 h-8" {repositoryUrl} />
                {/if}
                {#if customComponent}
                    {@render customComponent()}
                {/if}
                <DiagramNavigation class="flex flex-col" />
                <DocumentNavigation />
            </div>
        </Navigation>
    </BurgerMenu>
{/snippet}

<DocumentationProvider structurizrWorkspaceJson={workspaceJson}>
    <div class="flex flex-col w-screen h-screen app overflow-hidden">
        <!-- Title Bar -->
        <header class="flex justify-between items-center p-4 titlebar gap-4 overflow-hidden">
            <div class="flex items-center gap-4">
                {@render mobileMenu()}
                <button onclick={() => goto(`/`)} class="flex items-center">
                    <Logo class="h-10 fill-primary-500" />
                </button>
            </div>
            {#if capabilities.urlSelection}
                <UrlSelector class="flex-1 max-w-lg hidden lg:flex" {repositoryUrl} />
            {/if}
            <div class="hidden lg:block">
                {#if customComponent}
                    {@render customComponent()}
                {/if}
            </div>
            <div class="flex items-center gap-4">
                {#if capabilities.likeButton}
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
