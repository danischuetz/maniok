<script lang="ts">
    import DiagramView from './internal/diagram/diagramview.svelte'
    import { SvelteFlowProvider } from '@xyflow/svelte'
    import { selectedDiagram } from '../state/diagrams'
    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()
</script>

<div class="flex justify-center items-center {className}">
    {#if !$selectedDiagram}
        <h1 class="text-gray-500">No diagram selected</h1>
    {:else}
        <SvelteFlowProvider>
            <DiagramView class="w-full h-full" diagram={$selectedDiagram} />
        </SvelteFlowProvider>
    {/if}
</div>
