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
    <Popover.Trigger class="selectable-selected {className}">
        <span class="selectable-selected-title">{selected.title}</span>
        <ChevronDown />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="selectable-popup flex flex-col items-start z-100">
                <Popover.Context>
                    {#snippet children(popover)}
                        {#each selectables as selectable (selectable.id)}
                            <button
                                class="selectable-item"
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
