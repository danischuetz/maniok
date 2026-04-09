<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte'
    import Diagram from '../internal/diagram/diagram.svelte'
    import type { NavigationContextModel } from '../../model/navigation/navigationcontext'
    import { getContext } from 'svelte'
    import type { DiagramModel } from '../../model/diagram/diagrammodel'

    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()

    let navigationContext: NavigationContextModel = getContext('navigationContext')

    let currentFocusId: string | undefined = $derived(navigationContext.diagramFocusId)
    let diagram: DiagramModel | undefined = $derived.by(() => {
        const currentFocusId = navigationContext.diagramFocusId
        return navigationContext.diagrams.find((candidate) => candidate.id === currentFocusId)
    })
</script>

<Dialog open={diagram != undefined}>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 dialog-focus-modal-backdrop" />
        <Dialog.Positioner
            class="fixed inset-0 z-50 flex items-center dialog-focus-modal-positioner"
        >
            <Dialog.Content class="relative w-full dialog-focus-modal-content {className}">
                {#if diagram}
                    <Diagram class="w-full" {diagram} fitViewPort />
                {/if}
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>
