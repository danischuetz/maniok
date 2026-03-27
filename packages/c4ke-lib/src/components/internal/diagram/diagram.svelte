<script lang="ts">
    import type { DiagramModel } from '../../../model/diagram/diagrammodel'
    import DiagramFlow from './diagramflow.svelte'
    import { SvelteFlowProvider } from '@xyflow/svelte'
    interface Props {
        diagram?: DiagramModel | null
        class?: string
    }

    let { class: className, diagram }: Props = $props()
</script>

{#if !diagram}
    <p class="text-gray-500 {className}">Here should be a diagram</p>
{:else}
    <SvelteFlowProvider>
        <DiagramFlow class={className} {diagram} />
    </SvelteFlowProvider>
{/if}
