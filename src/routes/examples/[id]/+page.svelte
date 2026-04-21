<script lang="ts">
    import type { PageProps } from './$types'

    import App from '../../../lib/app.svelte'
    import type { CapabilitiesModel } from '../../../lib/model/capabilities'
    import Selectable from '../../../lib/components/selectable.svelte'
    import type { SelectableModel } from '../../../lib/model/selectable'
    import { goto } from '$app/navigation'

    let { data, params }: PageProps = $props()

    const capabilities: CapabilitiesModel = {
        urlSelection: false,
        likeButton: false
    }

    const selectables = [
        {
            id: 'filebrowser',
            title: 'Filebrowser',
            value: 'https://github.com/gtsteffaniak/filebrowser'
        },
        {
            id: 'finceptterminal',
            title: 'Fincept Terminal',
            value: 'https://github.com/Fincept-Corporation/FinceptTerminal'
        },
        {
            id: 'paperless-ngx',
            title: 'Paperless-ngx',
            value: 'https://github.com/paperless-ngx/paperless-ngx'
        },
        {
            id: 'voicebox',
            title: 'Voicebox',
            value: 'https://github.com/jamiepine/voicebox'
        }
    ]

    let selected: SelectableModel = $derived.by(() => {
        return selectables.find((s) => s.id === params.id) ?? selectables[0]
    })

    $effect(() => {
        if (selected) {
            goto(`/examples/${selected.id}`)
        }
    })
</script>

{#snippet exampleSelector()}
    <div class="flex items-start md:items-center gap-2 p-1 flex-col md:flex-row">
        <span class="pl-2">Select an example:</span>
        <Selectable {selectables} bind:selected />
    </div>
{/snippet}

<App
    {capabilities}
    repository={data.repository ?? undefined}
    workspaceJson={data.workspaceJson}
    customComponent={exampleSelector}
/>
