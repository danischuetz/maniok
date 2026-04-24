<script lang="ts">
    import type { ConnectionModel } from '../../../model/diagram/connection'
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle, Position } from '@xyflow/svelte'
    import { User } from 'lucide-svelte'
    import { UIUtils } from '../../../util/uiutils'
    let { data, width, height }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
    let connections = $derived((data.connections as Array<ConnectionModel>) ?? [])
</script>

{#each connections as connection}
    <Handle
        class={connection.type === 'target' ? 'opacity-0' : ''}
        type={connection.type as 'source' | 'target'}
        position={connection.position as Position}
        id={connection.id}
        style={UIUtils.getStyle(connection, connections, width, height, 0.5)}
    />
{/each}
<div class="flex flex-col items-center body-person">
    <User class="icon-person" />
    <span class="text-center name-person">{metaData.title}</span>
</div>
