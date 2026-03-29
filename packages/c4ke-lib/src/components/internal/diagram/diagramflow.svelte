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
        fitViewPort: boolean
    }

    let { class: className, diagram, fitViewPort = false }: Props = $props()

    let nodes: Node[] = $state.raw([])
    let edges: Edge[] = $state.raw([])

    let height: number = $state(0)
    let aspectRatio: number = $state(1)

    let containerElement: HTMLElement | undefined = $state()

    const fitViewOptions = {
        padding: 0.05,
        includeHiddenNodes: true
    }

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
        const resizeObserver = new ResizeObserver(() => {
            fitView(fitViewOptions)

            if (!containerElement) return
            if (!containerElement.clientWidth) return
            if (aspectRatio > 1) height = containerElement.clientWidth / aspectRatio || height
        })
        resizeObserver.observe(containerElement)
        return () => resizeObserver.disconnect()
    })

    async function layoutNodes() {
        const layoutModel: LayoutModel = XYFlowUtils.toLayoutModel(nodes, edges, diagram.direction)
        const layoutEngine = new LayoutService()
        layoutEngine.layout(layoutModel)

        const width = layoutModel.layoutElements.reduce(
            (max, element) => Math.max(max, element.x + element.width),
            0
        )
        height = layoutModel.layoutElements.reduce(
            (max, element) => Math.max(max, element.y + element.height),
            0
        )
        aspectRatio = width / height

        nodes = [...XYFlowUtils.applyLayoutToNodes(nodes, layoutModel)]

        requestAnimationFrame(() => {
            fitView(fitViewOptions)
        })
    }
</script>

<div bind:this={containerElement} class="diagram-viewport w-full {className}">
    <SvelteFlow
        bind:nodes
        bind:edges
        height={fitViewPort ? height : undefined}
        {nodeTypes}
        minZoom={0.2}
        maxZoom={10}
        proOptions={{ hideAttribution: true }}
    ></SvelteFlow>
</div>
