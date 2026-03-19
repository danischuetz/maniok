<script lang="ts">
    import { SvelteFlow, useSvelteFlow, type Node, type Edge } from '@xyflow/svelte'

    import type { DiagramModel } from '../../../model/diagram/diagrammodel'
    import { XYFlowUtils } from '../../../util/xyflowutils'
    import { LayoutEngine } from '../../../service/layoutengine'
    import ElementComponent from './element.svelte'
    import { DiagramUtils } from '../../../util/diagramutils'
    import type { LayoutModel } from '../../../model/layout/layoutmodel'

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

    // Update Nodes and Edges whenever the diagram changes
    $effect(() => {
        console.log('Updating nodes and edges for diagram:', diagram)
        const { nodes: newNodes, edges: newEdges } = XYFlowUtils.toNodesAndEdges(diagram)
        nodes = [...newNodes]
        edges = [...newEdges]

        // We need to do this in order to make sure the elements have been rendered before we can layout them.
        // Otherwise, the layout will be wrong because the elements have no dimensions.
        requestAnimationFrame(() => {
            console.log('First animation frame...')
            requestAnimationFrame(() => layoutNodes())
        })
    })

    $effect(() => {
        if (!containerElement) return
        const resizeObserver = new ResizeObserver(() => fitView())
        resizeObserver.observe(containerElement)
        return () => resizeObserver.disconnect()
    })

    async function layoutNodes() {
        console.log('Starting layout with nodes:', nodes, 'and edges:', edges)

        const layoutModel: LayoutModel = XYFlowUtils.toLayoutModel(nodes, edges, diagram.direction)
        const layoutEngine = new LayoutEngine()
        layoutEngine.layout(layoutModel)

        console.log('Layout model after layout:', layoutModel)

        nodes = [...XYFlowUtils.applyLayoutToNodes(nodes, layoutModel)]

        fitView({ padding: 0.05 })
    }
</script>

<div bind:this={containerElement} class={className}>
    <SvelteFlow bind:nodes bind:edges fitView {nodeTypes}></SvelteFlow>
</div>
