<script lang="ts">
    import { SvelteFlow, useSvelteFlow, type Node, type Edge } from '@xyflow/svelte'

    import type { DiagramModel } from '../../../model/diagram/diagrammodel'
    import { XYFlow } from '../../../util/xyflow'
    import { LayoutEngine } from '../../../service/layoutengine'
    import ElementComponent from './element.svelte'

    interface Props {
        class?: string
        diagram: DiagramModel
    }

    let { class: className, diagram }: Props = $props()

    let nodes: Node[] = $state.raw([])
    let edges: Edge[] = $state.raw([])

    let containerElement: HTMLElement | undefined = $state()

    const nodeTypes = {
        element: ElementComponent
    }

    const { fitView } = useSvelteFlow()

    $effect(() => {
        nodes = [...XYFlow.toNodes(diagram.elements)]
        edges = [...XYFlow.toEdges(diagram.relationships)]

        // We need to do this in order to make sure the elements have been rendered before we can layout them.
        // Otherwise, the layout will be wrong because the elements have no dimensions.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => initialize())
        })
    })

    $effect(() => {
        if (!containerElement) return
        const resizeObserver = new ResizeObserver(() => fitView())
        resizeObserver.observe(containerElement)
        return () => resizeObserver.disconnect()
    })

    async function initialize() {
        const layoutEngine = new LayoutEngine()
        layoutEngine.layout(diagram)

        nodes = [...XYFlow.toNodes(diagram.elements)]

        XYFlow.setSourceAndTargetPositions(nodes, edges, diagram.direction)
        fitView({ padding: 0.05 })
    }
</script>

<div bind:this={containerElement} class={className}>
    <SvelteFlow bind:nodes bind:edges fitView {nodeTypes}></SvelteFlow>
</div>
