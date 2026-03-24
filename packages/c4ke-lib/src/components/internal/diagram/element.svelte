<script lang="ts">
    import type { ElementMetaData } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle } from '@xyflow/svelte'

    let { data, sourcePosition, targetPosition }: NodeProps = $props()

    let metaData: ElementMetaData = $derived(data.metaData as ElementMetaData)
</script>

{#if sourcePosition}
    <Handle type="source" position={sourcePosition} />
{/if}
<div class="element-body flex flex-col space-y-2">
    <span class="element-name">{metaData.title}</span>
    <span class="element-type">{'[ ' + metaData.type + ' ]' + (metaData.technology ?? '')}</span>
    {#if metaData.description}
        <span class="element-description">{metaData.description}</span>
    {/if}
</div>
{#if targetPosition}
    <Handle class="opacity-0" type="target" position={targetPosition} />
{/if}
