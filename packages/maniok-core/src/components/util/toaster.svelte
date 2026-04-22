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
                <Toast.Description class="break-all">{toast.description}</Toast.Description>
            </Toast.Message>
            <Toast.CloseTrigger
                class="absolute right-1 bottom-1"
                onclick={() => toaster.dismiss(toast.id)}
            />
        </Toast>
    {/snippet}
</Toast.Group>
