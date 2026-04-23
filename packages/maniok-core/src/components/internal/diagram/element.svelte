<script lang="ts">
    import type { ConnectionModel } from '../../../model/diagram/connection'
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle, Position } from '@xyflow/svelte'

    let { data, width, height }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
    let connections = $derived(data.connections as Array<ConnectionModel>)

    let cssElementClassExtension = $derived.by(() => {
        return metaData.external ? 'external' : 'internal'
    })

    function getNumConnections(position: Position): number {
        return connections.filter((conn) => conn.position === position).length
    }

    function getStyle(connection: ConnectionModel): string {
        const total = getNumConnections(connection.position as Position)
        const index = connections
            .filter((conn) => conn.position === connection.position)
            .findIndex((conn) => conn.id === connection.id)

        const from: string =
            connection.position === Position.Top || connection.position === Position.Bottom
                ? 'left'
                : 'top'
        const mainDimension: number =
            connection.position === Position.Top || connection.position === Position.Bottom
                ? (width ?? 100)
                : (height ?? 100)

        console.log('(index + 1) * mainDimension / (total + 1)', index, mainDimension, total)

        const offset = ((index + 1) * mainDimension) / (total + 1)
        const style = `${from}: ${offset}px;`
        console.log('style', style)
        return style
    }
</script>

{#each connections as connection}
    <Handle
        class={connection.type === 'target' ? 'opacity-0' : ''}
        type={connection.type as 'source' | 'target'}
        position={connection.position as Position}
        id={connection.id}
        style={getStyle(connection)}
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
