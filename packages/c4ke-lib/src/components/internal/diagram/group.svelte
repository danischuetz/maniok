<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte'
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'

    let { data }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
</script>

<div class="absolute inset-0 flex flex-col justify-start items-start" role="group">
    {#if metaData.type && metaData.title}
        <p class="px-1 group-label">{metaData.type}: {metaData.title}</p>
    {/if}
</div>
