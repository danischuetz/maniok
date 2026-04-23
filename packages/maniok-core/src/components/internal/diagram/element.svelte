<script lang="ts">
    import type { ConnectionModel } from '../../../model/diagram/connection'
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle, Position } from '@xyflow/svelte'

    let { data }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
    let connections = $derived(data.connections as Array<ConnectionModel>)

    const handleSpacing = 20
    let cssElementClassExtension = $derived.by(() => {
        return metaData.external ? 'external' : 'internal'
    })

    function getNumConnections(position: Position): number {
        return connections.filter((conn) => conn.position === position).length
    }

    function getHandleOffset(connection: ConnectionModel): number {
        const total = getNumConnections(connection.position as Position)
        const index = connections
            .filter((conn) => conn.position === connection.position)
            .findIndex((conn) => conn.id === connection.id)
        return (index - (total - 1) / 2) * handleSpacing
    }
</script>

{#each connections as connection}
    <Handle
        class={connection.type === 'target' ? 'opacity-0' : ''}
        type={connection.type as 'source' | 'target'}
        position={connection.position as Position}
        id={connection.id}
        style={`top: calc(50% + ${getHandleOffset(connection)}px);`}
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
