<script lang="ts">
    import { NotificationService, Toaster } from 'maniok-core'
    import type { LayoutProps } from './$types'
    import { onMount } from 'svelte'

    onMount(async () => {
        const { init } = await import('@plausible-analytics/tracker')
        init({
            domain: 'app.maniok.io'
        })
    })

    let { children }: LayoutProps = $props()
</script>

{@render children()}

<Toaster toaster={NotificationService.getToasterInstance()} />
