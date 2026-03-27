<script lang="ts">
    import { SvelteFlow, useSvelteFlow, type Node, type Edge } from '@xyflow/svelte'

    import type { DiagramModel } from '../../../model/diagram/diagrammodel'
    import { XYFlowUtils } from '../../../util/xyflowutils'
    import { LayoutService } from '../../../service/layoutservice'
    import ElementComponent from './element.svelte'
    import GroupComponent from './group.svelte'
    import type { LayoutModel } from '../../../model/layout/layout'

    interface Props {
        class?: string
        diagram: DiagramModel
    }

    let { class: className, diagram }: Props = $props()

    let nodes: Node[] = $state.raw([])
    let edges: Edge[] = $state.raw([])

    let diagramDimensions: { width: number; height: number } = $state({ width: 0, height: 0 })

    let containerElement: HTMLElement | undefined = $state()

    const nodeTypes = {
        element: ElementComponent,
        group: GroupComponent
    }

    const { fitView } = useSvelteFlow()

    // Update Nodes and Edges whenever the diagram changes
    $effect(() => {
        const { nodes: newNodes, edges: newEdges } = XYFlowUtils.toNodesAndEdges(diagram)
        nodes = [...newNodes]
        edges = [...newEdges]

        // We need to do this in order to make sure the elements have been rendered before we can layout them.
        // Otherwise, the layout will be wrong because the elements have no dimensions.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => layoutNodes())
        })
    })

    $effect(() => {
        if (!containerElement) return
        const resizeObserver = new ResizeObserver(() => fitContainer())
        resizeObserver.observe(containerElement)
        return () => resizeObserver.disconnect()
    })

    function fitContainer() {
        if (!containerElement) return
        if (!containerElement.parentElement) return

        const availableWidth = containerElement.parentElement.clientWidth || 0
        const availableHeight = containerElement.parentElement.clientHeight || 0

        const scaleFactor = Math.min(
            availableWidth / diagramDimensions.width,
            availableHeight / diagramDimensions.height
        )

        containerElement.style.width = `${diagramDimensions.width * scaleFactor}px`
        containerElement.style.height = `${diagramDimensions.height * scaleFactor}px`

        fitView({ padding: { top: 0.05, right: 0.05, bottom: 0.15, left: 0.05 } })
    }

    async function layoutNodes() {
        const layoutModel: LayoutModel = XYFlowUtils.toLayoutModel(nodes, edges, diagram.direction)
        const layoutEngine = new LayoutService()
        layoutEngine.layout(layoutModel)

        diagramDimensions.width = layoutModel.layoutElements.reduce(
            (max, element) => Math.max(max, element.x + element.width),
            0
        )
        diagramDimensions.height = layoutModel.layoutElements.reduce(
            (max, element) => Math.max(max, element.y + element.height),
            0
        )

        nodes = [...XYFlowUtils.applyLayoutToNodes(nodes, layoutModel)]
        fitContainer()
    }
</script>

<div bind:this={containerElement} class={className}>
    <SvelteFlow bind:nodes bind:edges {nodeTypes} minZoom={0.2}></SvelteFlow>
</div>
