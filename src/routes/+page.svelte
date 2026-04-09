<script lang="ts">
    import type { RepositoryModel } from 'maniok-core'
    import { NotificationService, RepositoryService, Logo, UrlSelector } from 'maniok-core'

    import { goto } from '$app/navigation'

    let repositoryUrl: string = $state('')
    let navigating: boolean = $state(false)

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

    async function handleConfirmation() {
        navigating = true
        await new Promise((resolve) => setTimeout(resolve, 400))
        await onRepositoryUrlConfirmation()
        navigating = false
    }

    async function onDemoClick() {
        //focus the url selector
        const urlSelector = document.querySelector('.urlselector-input') as HTMLInputElement
        urlSelector?.focus()

        const url = 'https://github.com/danischuetz/maniok'
        repositoryUrl = ''
        for (const char of url) {
            repositoryUrl += char
            await new Promise((resolve) => setTimeout(resolve, 40))
        }
        await handleConfirmation()
    }
</script>

<div class="app flex flex-col items-center justify-center w-screen h-screen">
    <div class="flex flex-col items-start gap-8 px-4">
        <div class="flex flex-col items-start gap-2">
            <Logo class="max-h-32 w-full fill-primary-500" />
            <p class="text-lg">The git-native solution for C4 architecture documentation.</p>
        </div>

        <div class="flex flex-col gap-4 self-stretch">
            <div class:navigating>
                <UrlSelector
                    class="self-stretch h-10"
                    bind:repositoryUrl
                    onConfirmation={handleConfirmation}
                />
            </div>
            <button
                class="btn font-bold preset-filled-surface-950-50 rounded-full self-end"
                onclick={onDemoClick}>Wait, what? How?</button
            >
        </div>
    </div>
</div>

<style>
    @keyframes btn-press {
        0% {
            transform: scale(1);
        }
        35% {
            transform: scale(0.99);
        }
        70% {
            transform: scale(1.06);
        }
        100% {
            transform: scale(1);
        }
    }

    .navigating :global(.urlselector-button) {
        animation: btn-press 0.35s ease-out forwards;
    }
</style>
