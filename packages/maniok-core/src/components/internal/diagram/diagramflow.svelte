<script lang="ts">
    import { SvelteFlow, useSvelteFlow, type Node, type Edge } from '@xyflow/svelte'

    import type { DiagramModel } from '../../../model/diagram/diagrammodel'
    import { XYFlowUtils } from '../../../util/xyflowutils'
    import { LayoutService } from '../../../service/layoutservice'
    import ElementComponent from './element.svelte'
    import GroupComponent from './group.svelte'
    import type { LayoutModel } from '../../../model/layout/layout'
    import type { NavigationContextModel } from '../../../model/navigation/navigationcontext'
    import { getContext } from 'svelte'
    import { Maximize, Minimize } from 'lucide-svelte'
    import PersonComponent from './person.svelte'
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
    let navigationContext: NavigationContextModel = getContext('navigationContext')
    let isFocussed: boolean = $derived(navigationContext.diagramFocusId == diagram.id)

    const fitViewOptions = {
        padding: {
            top: 0.1,
            right: 0.1,
            bottom: 0.2,
            left: 0.1
        },
        includeHiddenNodes: true
    }

    const nodeTypes = {
        element: ElementComponent,
        person: PersonComponent,
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
            clientWidth = containerElement ? (containerElement.clientWidth ?? undefined) : undefined
        })

        clientWidth = containerElement ? (containerElement.clientWidth ?? undefined) : undefined
        resizeObserver.observe(containerElement)
        return () => resizeObserver.disconnect()
    })

    async function layoutNodes() {
        const layoutModel: LayoutModel = XYFlowUtils.toLayoutModel(nodes, edges, diagram.direction)
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

        nodes = [...XYFlowUtils.applyLayoutToNodes(nodes, layoutModel)]

        requestAnimationFrame(() => {
            fitView(fitViewOptions)
        })
    }

    async function toggleFocus() {
        navigationContext.diagramFocusId = isFocussed ? undefined : diagram.id
    }
</script>

<div bind:this={containerElement} class="relative diagram-viewport w-full flex-col {className}">
    <button
        type="button"
        class="btn-icon-diagram absolute right-0 top-0 z-50"
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
        minZoom={0.2}
        maxZoom={10}
        preventScrolling={false}
        panOnDrag={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        disableKeyboardA11y={true}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
    ></SvelteFlow>

    <p class="diagram-label">{diagram.type}: {diagram.title}</p>
</div>
