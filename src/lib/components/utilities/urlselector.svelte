<script lang="ts">
    import { goto } from '$app/navigation'
    import { NotificationService, RepositoryService, type RepositoryModel } from 'maniok-core'

    interface Props {
        class?: string
        repositoryUrl: string
    }

    let { class: className, repositoryUrl }: Props = $props()

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

        goto(`/${repository.provider}/${repository.org}/${repository.name}`)
    }
</script>

<form
    class="flex items-center focus-within urlselector {className}"
    onsubmit={(e) => {
        e.preventDefault()
        onRepositoryUrlConfirmation()
    }}
>
    <input
        name="repositoryUrl"
        type="text"
        placeholder="Enter a GitHub repo URL with Maniok documentation"
        bind:value={repositoryUrl}
        class="urlselector-input"
    />
    <button type="submit" disabled={!repositoryUrl} class="urlselector-button"> Load </button>
</form>
