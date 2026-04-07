<script lang="ts">
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { Menu } from 'lucide-svelte'
    import type { Snippet } from 'svelte'

    interface Props {
        class?: string
        children: Snippet
    }

    let { class: className = '', children }: Props = $props()
</script>

<Popover>
    <Popover.Trigger class="btn flex items-center justify-center {className} "
        ><Menu class="lucide-icon-sm" />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="card">
                {@render children()}
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
