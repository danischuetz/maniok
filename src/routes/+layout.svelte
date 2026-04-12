<script lang="ts">
    import '../css/app.css'
    import { afterNavigate } from '$app/navigation'
    import { NotificationService, Toaster } from 'maniok-core'
    import type { LayoutProps } from './$types'
    import { onMount } from 'svelte'
    import type { CustomProperties } from '@plausible-analytics/tracker'

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
            autoCapturePageviews: false,
            customProperties: (eventName): CustomProperties => {
                if (eventName === 'pageview') {
                    const isExampleDocumentation: boolean =
                        document.URL === 'local' ||
                        document.URL === 'Z2l0aHViOmRhbmlzY2h1ZXR6L21hbmlvaw'
                    return {
                        type: isExampleDocumentation ? 'example' : 'custom'
                    }
                }
                return {}
            }
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
