<script lang="ts">
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { Menu } from 'lucide-svelte'
    import type { Snippet } from 'svelte'

    interface Props {
        class?: string
        children: Snippet
        onNavigation: () => void
    }

    let open = $state(false)
    let { class: className = '', children, onNavigation = $bindable() }: Props = $props()

    onNavigation = () => {
        open = false
    }
</script>

<Popover {open} onOpenChange={(value) => (open = value.open)}>
    <Popover.Trigger class="btn flex items-center justify-center {className} "
        ><Menu class="lucide-icon-sm" />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content
                class="card z-40 max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-auto rounded-md"
                style="width: max-content;"
            >
                {@render children()}
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
