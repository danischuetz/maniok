<script lang="ts">
    import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte'

    type Toaster = ReturnType<typeof createToaster>

    interface Props {
        toaster: Toaster
    }

    let { toaster }: Props = $props()
</script>

<Toast.Group {toaster}>
    {#snippet children(toast)}
        <Toast {toast}>
            <Toast.Message>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
            </Toast.Message>
            <Toast.CloseTrigger onclick={() => toaster.dismiss(toast.id)} />
        </Toast>
    {/snippet}
</Toast.Group>
