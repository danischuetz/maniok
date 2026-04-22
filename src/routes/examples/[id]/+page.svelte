<script lang="ts">
    import type { PageProps } from './$types'
    import { onMount } from 'svelte'
    import { NotificationService } from 'maniok-core'

    import App from '../../../lib/app.svelte'
    import type { CapabilitiesModel } from '../../../lib/model/capabilities'
    import Selectable from '../../../lib/components/utilities/selectable.svelte'
    import type { SelectableModel } from '../../../lib/model/selectable'
    import { goto } from '$app/navigation'
    import Exampledisclaimer from '../../../lib/components/modal/exampledisclaimer.svelte'

    let { data, params }: PageProps = $props()

    const capabilities: CapabilitiesModel = {
        urlSelection: false,
        likeButton: false
    }

    const selectables = [
        {
            id: 'bitcoin',
            title: 'Bitcoin',
            value: 'https://github.com/bitcoin/bitcoin'
        },
        {
            id: 'linux',
            title: 'Linux Kernel',
            value: 'https://github.com/torvalds/linux'
        },
        {
            id: 'paperless-ngx',
            title: 'Paperless-ngx',
            value: 'https://github.com/paperless-ngx/paperless-ngx'
        },
        {
            id: 'vscode',
            title: 'Visual Studio Code',
            value: 'https://github.com/microsoft/vscode'
        }
    ]

    let selected: SelectableModel = $derived.by(() => {
        return selectables.find((s) => s.id === params.id) ?? selectables[0]
    })

    onMount(() => {
        NotificationService.notifyInfo(
            'This example was AI-generated from a public GitHub repository using the Maniok architecture documentation prompt!'
        )
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
        <Exampledisclaimer repository={selected.value} />
    </div>
{/snippet}

<App
    {capabilities}
    repository={data.repository ?? undefined}
    workspaceJson={data.workspaceJson}
    customComponent={exampleSelector}
/>
