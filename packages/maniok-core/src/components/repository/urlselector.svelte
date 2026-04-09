<script lang="ts">
    interface Props {
        class?: string
        repositoryUrl: string
        onConfirmation: () => void
    }

    let { class: className, repositoryUrl = $bindable(), onConfirmation }: Props = $props()
</script>

<form
    class="flex items-center focus-within urlselector {className}"
    onsubmit={(e) => {
        e.preventDefault()
        onConfirmation()
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
