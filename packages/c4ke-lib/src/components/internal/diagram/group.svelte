<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte'
    import type { ElementMetaData } from '../../../model/diagram/elementmetadata'

    let { data, width, height }: NodeProps = $props()

    let metaData: ElementMetaData = $derived(data.metaData as ElementMetaData)
</script>

<div class="absolute inset-0 flex flex-col justify-start items-start" role="group">
    {#if metaData.type && metaData.title}
        <p class="px-1 group-label">{metaData.type}: {metaData.title}</p>
    {/if}
</div>
