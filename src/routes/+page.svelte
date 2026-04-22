<script lang="ts">
    import type { RepositoryModel } from 'maniok-core'
    import { NotificationService, RepositoryService, Logo } from 'maniok-core'
    import UrlSelector from '$lib/components/utilities/urlselector.svelte'

    import { goto } from '$app/navigation'
    import ExampleSelection from '$lib/components/exampleselection.svelte'

    let repositoryUrl: string = $state('')
    let navigating: boolean = $state(false)

    async function onRepositoryUrlConfirmation() {
        if (!repositoryUrl) return

        if (repositoryUrl === 'local') {
            goto('/local')
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

        goto(`/${repository.provider}/${repository.org}/${repository.name}`)
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

<div
    class="app flex flex-col items-center justify-start md:justify-center w-screen min-h-screen overflow-auto py-4 lg:py-8"
>
    <div class="flex flex-col items-start gap-8 lg:gap-16 px-4">
        <div class="flex flex-col items-start gap-2">
            <Logo class="max-h-32 w-full fill-primary-500" />
            <p class="text-lg">The git-native solution for C4 architecture documentation.</p>
        </div>

        <div class="flex flex-col gap-4 self-stretch">
            <div class:navigating>
                <UrlSelector class="self-stretch h-10" {repositoryUrl} />
            </div>
            <div class="flex items-center gap-2 self-end">
                <button class="btn preset-filled-surface-950-50 rounded-full" onclick={onDemoClick}
                    >Docs / Demo</button
                >
                <ExampleSelection />
            </div>
        </div>

        <div class="flex flex-col gap-4 max-w-[calc(100vw-1rem)]">
            <h4 class="h4">Quick Start</h4>
            <ol class="flex flex-col max-w-3xl list-decimal list-outside pl-5 gap-2">
                <li>
                    Run the <a
                        class="a underline"
                        href="https://github.com/danischuetz/maniok/blob/main/examples/maniok-architecture-prompt.md"
                        >Maniok Architecture Prompt</a
                    > in your repository to generate a C4 model from your codebase
                </li>
                <li>
                    Pull & run the Maniok-Preview Docker image, replacing `PATH` with the path to
                    the created .maniok folder
                    <div class="code">
                        <p>docker pull ghcr.io/danischuetz/maniok/maniok-preview:latest</p>
                        <p>docker tag ghcr.io/danischuetz/maniok/maniok-preview maniok-preview</p>
                        <p>
                            docker run -t --rm -p 8080:8080 -v PATH:/usr/workspace
                            maniok-preview:latest
                        </p>
                    </div>
                </li>
                <li>
                    Open the URL http://localhost:8080 in your browser and start editing.
                    Maniok-Preview automatically exports your workspace and supports hot-reload! 🚀
                </li>
                <li>
                    Optional: Publish the changes and view/share the documentation through <a
                        class="a underline"
                        href="https://app.maniok.io">https://app.maniok.io</a
                    >
                    (public repositories only atm)
                </li>
            </ol>
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
