<script lang="ts">
    import type { PageProps } from './$types'
    import { invalidate } from '$app/navigation'
    import { onMount } from 'svelte'

    import App from '../../lib/app.svelte'
    import type { CapabilitiesModel } from '../../lib/model/capabilities'

    let { data }: PageProps = $props()

    const capabilities: CapabilitiesModel = {
        urlSelection: false,
        likeButton: false
    }

    onMount(() => {
        const interval = setInterval(async () => {
            const res = await fetch('/local/workspacechanged', { cache: 'no-store' })
            const { hasChanged } = await res.json()
            if (hasChanged) {
                await invalidate('workspace:reload')
            }
        }, 500)

        return () => clearInterval(interval)
    })
</script>

<App {capabilities} repository={data.repository ?? undefined} workspaceJson={data.workspaceJson} />
