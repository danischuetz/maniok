<script lang="ts">
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle } from '@xyflow/svelte'

    let { data, sourcePosition, targetPosition }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
    let cssElementClassExtension = $derived.by(() => {
        return metaData.external ? 'external' : 'internal'
    })
</script>

{#if sourcePosition}
    <Handle type="source" position={sourcePosition} />
{/if}
<div class="flex flex-col space-y-2 element-body-base element-body-{cssElementClassExtension}">
    <span class="element-name-{cssElementClassExtension}">{metaData.title}</span>
    <span class="element-type-{cssElementClassExtension}"
        >{'[ ' +
            metaData.type +
            ' ]' +
            (metaData.technology ? ' ' + metaData.technology : '')}</span
    >
    {#if metaData.description}
        <span class="element-description-{cssElementClassExtension}">{metaData.description}</span>
    {/if}
</div>
{#if targetPosition}
    <Handle class="opacity-0" type="target" position={targetPosition} />
{/if}
