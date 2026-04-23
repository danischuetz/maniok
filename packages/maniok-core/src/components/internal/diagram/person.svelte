<script lang="ts">
    import type { ConnectionModel } from '../../../model/diagram/connection'
    import type { ElementMetaDataModel } from '../../../model/diagram/elementmetadata'
    import { type NodeProps, Handle, Position } from '@xyflow/svelte'
    import { User } from 'lucide-svelte'

    let { data }: NodeProps = $props()

    let metaData: ElementMetaDataModel = $derived(data.metaData as ElementMetaDataModel)
    let connections = $derived((data.connections as Array<ConnectionModel>) ?? [])
</script>

{#each connections as connection}
    <Handle
        type={connection.type as 'source' | 'target'}
        position={connection.position as Position}
        id={connection.id}
    />
{/each}
<div class="flex flex-col items-center body-person">
    <User class="icon-person" />
    <span class="text-center name-person">{metaData.title}</span>
</div>
