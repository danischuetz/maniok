<script lang="ts">
    import {
        SvelteFlow,
        useSvelteFlow,
        useUpdateNodeInternals,
        type Node,
        type Edge
    } from '@xyflow/svelte'

    import type { DiagramModel } from '../../../model/diagram/diagrammodel'
    import { XYFlowService } from '../../../service/xyflowservice'
    import type { EdgeLabelSizeById } from '../../../service/xyflowservice'
    import { LayoutService } from '../../../service/layoutservice'
    import ElementComponent from './element.svelte'
    import GroupComponent from './group.svelte'
    import type { LayoutModel } from '../../../model/layout/layout'
    import type { DocumentationContextModel } from '../../../model/documentation/documentationcontext'
    import { getContext } from 'svelte'
    import { Maximize, Minimize } from 'lucide-svelte'
    import PersonComponent from './person.svelte'
    import CustomEdge from './edge.svelte'
    interface Props {
        class?: string
        diagram: DiagramModel
        fitViewPort: boolean
    }

    let { class: className, diagram, fitViewPort = false }: Props = $props()

    let nodes: Node[] = $state.raw([])
    let edges: Edge[] = $state.raw([])

    let clientWidth: number | undefined = $state(undefined)
    let initialHeight: number = $state(0)
    let height: number = $derived.by(() => {
        if (!clientWidth) return 0
        return Math.min(clientWidth / aspectRatio, initialHeight * 1.2)
    })
    let aspectRatio: number = $state(1)

    let containerElement: HTMLElement | undefined = $state()
    let documentationContext: DocumentationContextModel = getContext('documentationContext')
    let isFocussed: boolean = $derived(documentationContext.diagramFocusId == diagram.id)

    const fitViewOptions = {
        padding: {
            top: 0.1,
            right: 0.2,
            bottom: 0.2,
            left: 0.1
        },
        includeHiddenNodes: true
    }

    const EDGE_LABEL_SELECTOR = '.svelte-flow__edge-label[data-edge-id]'

    const nodeTypes = {
        element: ElementComponent,
        person: PersonComponent,
        group: GroupComponent
    }

    const edgeTypes = {
        custom: CustomEdge
    }

    const { fitView, getZoom } = useSvelteFlow()
    const updateNodeInternals = useUpdateNodeInternals()

    // Update Nodes and Edges whenever the diagram changes
    $effect(() => {
        const { nodes: newNodes, edges: newEdges } = XYFlowService.toNodesAndEdges(diagram)
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
            clientWidth = containerElement ? (containerElement.clientWidth ?? undefined) : undefined
        })

        clientWidth = containerElement ? (containerElement.clientWidth ?? undefined) : undefined
        resizeObserver.observe(containerElement)
        return () => resizeObserver.disconnect()
    })

    async function layoutNodes() {
        const measuredLabelSizes = readEdgeLabelSizesFromDom()

        const layoutModel: LayoutModel = XYFlowService.toLayoutModel(
            nodes,
            diagram.relationships,
            diagram.direction
        )
        const layoutEngine = new LayoutService()
        layoutEngine.layout(layoutModel)

        const initialWidth = layoutModel.layoutElements.reduce(
            (max, element) => Math.max(max, element.x + element.width),
            0
        )
        initialHeight = layoutModel.layoutElements.reduce(
            (max, element) => Math.max(max, element.y + element.height),
            0
        )
        aspectRatio = initialWidth / initialHeight

        nodes = [...XYFlowService.applyLayoutToNodes(nodes, layoutModel)]
        const positioned = XYFlowService.setSourceAndTargetPositions(
            nodes,
            edges,
            diagram.direction
        )
        nodes = [...positioned.nodes]
        edges = [
            ...XYFlowService.positionEdgeLabels(
                positioned.nodes,
                positioned.edges,
                measuredLabelSizes
            )
        ]
        updateNodeInternals(nodes.map((node) => node.id))

        requestAnimationFrame(() => {
            fitView(fitViewOptions)
        })
    }

    function readEdgeLabelSizesFromDom(): EdgeLabelSizeById {
        if (!containerElement) return {}

        const currentEdgesWithLabels = edges.filter(
            (edge) => String(edge.label ?? '').trim().length > 0
        )
        if (currentEdgesWithLabels.length === 0) return {}

        const knownEdgeIds = new Set(currentEdgesWithLabels.map((edge) => edge.id))
        const measuredById: EdgeLabelSizeById = {}

        const zoom = getZoom()
        const flowZoom = Number.isFinite(zoom) && zoom > 0 ? zoom : 1
        const labelElements = containerElement.querySelectorAll<HTMLElement>(EDGE_LABEL_SELECTOR)

        labelElements.forEach((element) => {
            const edgeId = element.dataset.edgeId
            if (!edgeId || !knownEdgeIds.has(edgeId)) return

            const rect = element.getBoundingClientRect()
            if (rect.width <= 0 || rect.height <= 0) return

            measuredById[edgeId] = {
                width: rect.width / flowZoom,
                height: rect.height / flowZoom
            }
        })

        return measuredById
    }

    async function toggleFocus() {
        documentationContext.diagramFocusId = isFocussed ? undefined : diagram.id
    }
</script>

<div bind:this={containerElement} class="relative diagram-viewport w-full flex-col {className}">
    <button
        type="button"
        class="btn-icon-diagram absolute right-1 top-1 z-30"
        onclick={toggleFocus}
        aria-pressed={isFocussed}
    >
        {#if isFocussed}
            <Minimize class="icon-diagram" />
        {:else}
            <Maximize class="icon-diagram" />
        {/if}
    </button>

    <SvelteFlow
        bind:nodes
        bind:edges
        height={fitViewPort ? height : undefined}
        {nodeTypes}
        {edgeTypes}
        minZoom={0.2}
        maxZoom={2}
        preventScrolling={false}
        panOnDrag={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        disableKeyboardA11y={true}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
    ></SvelteFlow>

    <p class="diagram-label">{diagram.title}</p>
</div>
