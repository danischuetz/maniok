<script lang="ts">
    interface Props {
        class?: string
        repositoryUrl: string
        onConfirmation: () => void
    }

    let { class: className, repositoryUrl = $bindable(), onConfirmation }: Props = $props()
</script>

<form class="flex items-center focus-within urlselector {className}">
    <input
        type="text"
        placeholder="Enter a GitHub repository URL"
        bind:value={repositoryUrl}
        class="urlselector-input"
    />
    <button
        type="submit"
        onclick={onConfirmation}
        disabled={!repositoryUrl}
        class="urlselector-button"
    >
        Load
    </button>
</form>
