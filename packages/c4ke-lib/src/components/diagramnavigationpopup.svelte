<script lang="ts">
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { DiagramNavigation } from '..'
    import { Hamburger } from 'lucide-svelte'

    interface Props {
        class?: string
    }

    let { class: className = '' }: Props = $props()
</script>

<Popover>
    <Popover.Trigger class="btn flex items-center justify-center {className} "
        ><Hamburger />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="card">
                <DiagramNavigation />
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
