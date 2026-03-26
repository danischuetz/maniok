<script lang="ts">
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import { ModeEnum } from '../../model/navigation/navigationcontext'
    import DiagramView from '../internal/diagram/diagramview.svelte'
    import { SvelteFlowProvider } from '@xyflow/svelte'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'
    interface Props {
        diagram?: DiagramModel | null
        class?: string
    }

    let { class: className, diagram }: Props = $props()
</script>

<ModeWrapper mode={ModeEnum.Diagrams}>
    <div class="h-full w-full {className}">
        {#if !diagram}
            <h1 class="text-gray-500">No diagram selected</h1>
        {:else}
            <SvelteFlowProvider>
                <DiagramView class="w-full h-full" {diagram} />
            </SvelteFlowProvider>
        {/if}
    </div>
</ModeWrapper>
