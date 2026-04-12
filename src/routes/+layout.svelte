<script lang="ts">
    import '../css/app.css'
    import { afterNavigate } from '$app/navigation'
    import { NotificationService, Toaster } from 'maniok-core'
    import type { LayoutProps } from './$types'
    import { onMount } from 'svelte'

    let trackPageview: ((url?: string) => void) | undefined = undefined

    afterNavigate(({ to }) => {
        if (!trackPageview) return
        trackPageview(to?.url.href)
    })

    onMount(async () => {
        const { init, track } = await import('@plausible-analytics/tracker')
        init({
            domain: 'app.maniok.io',
            outboundLinks: true,
            autoCapturePageviews: false
        })

        trackPageview = (url?: string) => {
            track('pageview', { url: url ?? window.location.href })
        }

        trackPageview(window.location.href)
    })

    let { children }: LayoutProps = $props()
</script>

{@render children()}

<Toaster toaster={NotificationService.getToasterInstance()} />
