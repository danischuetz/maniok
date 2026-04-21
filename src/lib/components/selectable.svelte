<script lang="ts">
    import type { SelectableModel } from '../model/selectable'
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { ChevronDown } from 'lucide-svelte'

    interface Props {
        class?: string
        selectables: Array<SelectableModel>
        selected: SelectableModel
    }

    let { class: className = '', selectables, selected = $bindable() }: Props = $props()
</script>

<Popover positioning={{ placement: 'bottom-start' }}>
    <Popover.Trigger class="btn bg-bg-4 flex items-center space-x-3 {className}">
        <span class="text-base">{selected.title}</span>
        <ChevronDown />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="card bg-bg-4 p-1 flex flex-col">
                <Popover.Context>
                    {#snippet children(popover)}
                        {#each selectables as selectable (selectable.id)}
                            <button
                                class="px-4 py-2 text-left text-base rounded hover:preset-tonal"
                                onclick={() => {
                                    selected = selectable
                                    popover().setOpen(false)
                                }}
                            >
                                {selectable.title}
                            </button>
                        {/each}
                    {/snippet}
                </Popover.Context>
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
