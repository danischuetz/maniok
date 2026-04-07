<script lang="ts">
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle } from '@xyflow/svelte'
    import { User } from 'lucide-svelte'

    let { data, sourcePosition, targetPosition }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
</script>

{#if sourcePosition}
    <Handle type="source" position={sourcePosition} />
{/if}
<div class="flex flex-col items-center body-person">
    <User class="icon-person" />
    <span class="name-person">{metaData.title}</span>
</div>
{#if targetPosition}
    <Handle class="opacity-0" type="target" position={targetPosition} />
{/if}
