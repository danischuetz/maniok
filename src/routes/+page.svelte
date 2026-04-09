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

    let repositoryUrl: string = $state('')
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

<div class="app flex flex-col items-center justify-center w-screen h-screen">
    <div class="flex flex-col items-start gap-8 px-4">
        <div class="flex flex-col items-start gap-2">
            <Logo class="max-h-32 w-full fill-primary-500" />
            <p class="text-lg">The git-native solution for C4 architecture documentation.</p>
        </div>
        <UrlSelector
            class="self-stretch"
            bind:repositoryUrl
            onConfirmation={onRepositoryUrlConfirmation}
        />
    </div>
</div>
