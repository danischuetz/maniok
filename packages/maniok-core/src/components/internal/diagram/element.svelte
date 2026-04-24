<script lang="ts">
    import type { ConnectionModel } from '../../../model/diagram/connection'
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle, Position } from '@xyflow/svelte'
    import { UIUtils } from '../../../util/uiutils'
    let { data, width, height }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
    let connections = $derived(data.connections as Array<ConnectionModel>)

    let cssElementClassExtension = $derived.by(() => {
        return metaData.external ? 'external' : 'internal'
    })
</script>

{#each connections as connection}
    <Handle
        class={connection.type === 'target' ? 'opacity-0' : ''}
        type={connection.type as 'source' | 'target'}
        position={connection.position as Position}
        id={connection.id}
        style={UIUtils.getStyle(connection, connections, width, height)}
    />
{/each}
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
