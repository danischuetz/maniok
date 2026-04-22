<script lang="ts">
    import type { SelectableModel } from '../../model/selectable'
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { ChevronDown } from 'lucide-svelte'

    interface Props {
        class?: string
        selectables: Array<SelectableModel>
        selected: SelectableModel | undefined
        placeholder: string
    }

    let {
        class: className = '',
        selectables,
        selected = $bindable(),
        placeholder = ''
    }: Props = $props()
</script>

<Popover positioning={{ placement: 'bottom-start' }}>
    <Popover.Trigger class="selectable-selected {className}">
        {#if selected}
            <span class="selectable-selected-title">{selected.title}</span>
        {:else}
            <span class="selectable-selected-placeholder">{placeholder}</span>
        {/if}
        <ChevronDown />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="selectable-popup flex flex-col items-start z-40">
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
