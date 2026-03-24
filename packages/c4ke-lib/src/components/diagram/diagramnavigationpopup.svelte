<script lang="ts">
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { Menu } from 'lucide-svelte'

    import DiagramNavigation from './diagramnavigation.svelte'
    import type { DiagramModel } from '../../model/diagram/diagrammodel'

    interface Props {
        class?: string
        diagrams: DiagramModel[]
        selectedDiagram: DiagramModel | null
    }

    let { class: className = '', diagrams, selectedDiagram = $bindable() }: Props = $props()
</script>

<Popover>
    <Popover.Trigger class="btn flex items-center justify-center {className} "
        ><Menu class="lucide-icon-sm" />
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="card">
                <DiagramNavigation {diagrams} {selectedDiagram} />
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
