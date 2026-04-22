<script lang="ts">
    import type { PageProps } from './$types'

    import App from '$lib/app.svelte'
    import type { CapabilitiesModel } from '$lib/model/capabilities'
    import ExampleSelection from '$lib/components/exampleselection.svelte'

    let { data }: PageProps = $props()

    const capabilities: CapabilitiesModel = {
        urlSelection: true
    }
</script>

{#snippet exampleSelector()}
    <div class="flex items-start md:items-center gap-2 p-1 flex-col md:flex-row">
        <div class="flex gap-2 lg:pr-8">
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
