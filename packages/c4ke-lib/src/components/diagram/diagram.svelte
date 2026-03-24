<script lang="ts">
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import DiagramView from '../internal/diagram/diagramview.svelte'
    import { SvelteFlowProvider } from '@xyflow/svelte'
    interface Props {
        diagram?: DiagramModel | null
        class?: string
    }

    let { class: className, diagram }: Props = $props()
</script>

<div class={className}>
    {#if !diagram}
        <h1 class="text-gray-500">No diagram selected</h1>
    {:else}
        <SvelteFlowProvider>
            <DiagramView class="w-full h-full" {diagram} />
        </SvelteFlowProvider>
    {/if}
</div>
