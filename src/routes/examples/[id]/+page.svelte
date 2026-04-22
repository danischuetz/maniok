<script lang="ts">
    import type { PageProps } from './$types'
    import { onMount } from 'svelte'
    import { NotificationService } from 'maniok-core'

    import App from '$lib/app.svelte'
    import type { CapabilitiesModel } from '$lib/model/capabilities'
    import { goto } from '$app/navigation'
    import ExampleDisclaimer from '$lib/components/modal/exampledisclaimer.svelte'
    import ExampleSelection from '$lib/components/exampleselection.svelte'
    import { selectedExample, selectFromId } from '$lib/state/examplepage'
    import type { RepositoryModel } from 'maniok-core'
    import { RepositoryService } from 'maniok-core'

    let { data, params }: PageProps = $props()

    let exampleRepositoryUrl: string = $derived($selectedExample?.value || '')

    const capabilities: CapabilitiesModel = {
        urlSelection: false
    }

    onMount(() => {
        NotificationService.notifyInfo(
            'This example was AI-generated from a public GitHub repository using the Maniok architecture documentation prompt!'
        )
    })

    $effect(() => {
        selectFromId(params.id)
    })

    async function goToDocs() {
        const repository: RepositoryModel | null = await RepositoryService.deriveFromUrl(
            'https://github.com/danischuetz/maniok'
        )
        goto(`/${repository?.provider}/${repository?.org}/${repository?.name}`)
    }
</script>

{#snippet exampleSelector()}
    <div class="flex items-start md:items-center gap-2 p-1 flex-col md:flex-row">
        <div class="flex gap-2">
            <button onclick={goToDocs} class="btn preset-filled">Docs</button>
            <button onclick={() => goto(`/`)} class="btn preset-filled-primary-500"
                >Get Started!</button
            >
        </div>
        <span class="pl-2">Select an <ExampleDisclaimer repository={exampleRepositoryUrl} /></span>
        <div class="flex gap-2">
            <ExampleSelection />
        </div>
    </div>
{/snippet}

<App
    {capabilities}
    repository={data.repository ?? undefined}
    workspaceJson={data.workspaceJson}
    customComponent={exampleSelector}
/>
