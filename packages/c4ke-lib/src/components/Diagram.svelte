<script lang="ts">
    import { getContext } from 'svelte'
    import type { DiagramModel } from '../model/diagram/diagrammodel'
    import DiagramView from './internal/diagram/diagramview.svelte'
    import { SvelteFlowProvider } from '@xyflow/svelte'
    interface Props {
        class: string
    }

    let { class: className }: Props = $props()

    let getDiagrams = getContext('diagrams') as () => DiagramModel[]
    let diagrams: DiagramModel[] = $derived(getDiagrams())
    // let selectedDiagramIndex: number = getContext('selectedDiagramIndex')
    let selectedDiagramIndex: number = $state(0)

    let selectedDiagram: DiagramModel | undefined = $derived(
        diagrams.length > selectedDiagramIndex ? diagrams[selectedDiagramIndex] : undefined
    )

    function incrementDiagramIndex() {
        selectedDiagramIndex = (selectedDiagramIndex + 1) % diagrams.length
    }
</script>

<div class="flex justify-center items-center {className}">
    {#if !selectedDiagram}
        <h1 class="text-gray-500">No diagram selected</h1>
    {:else}
        <button onclick={incrementDiagramIndex}>NEXT</button>
        <SvelteFlowProvider>
            <DiagramView class="w-full h-full" diagram={selectedDiagram} />
        </SvelteFlowProvider>
    {/if}
</div>
