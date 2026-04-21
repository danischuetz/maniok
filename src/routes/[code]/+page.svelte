<CapabilitiesModel"ts">
    import type { PageProps } from './$types'

    import App from '../../lib/app.svelte'
    import type { Capabilities } from '../../lib/model/capabilities'

    let { data }: PCapabilitiesModel      likeButton: true
    }
</script>

<App {capabilities} repository={data.repository ?? undefined} workspaceJson={data.workspaceJson} />
