<script lang="ts">
    import '../css/app.css'

    import { afterNavigate } from '$app/navigation'
    import { page } from '$app/state'
    import {
        NotificationService,
        RepositoryService,
        Toaster,
        type RepositoryModel
    } from 'maniok-core'
    import type { LayoutProps } from './$types'
    import { onMount } from 'svelte'
    import type { CustomProperties } from '@plausible-analytics/tracker'
    import { selectedExample } from '$lib/state/examplepage'

    let trackPageview: ((url?: string) => void) | undefined = undefined

    afterNavigate(({ to }) => {
        if (!trackPageview) return
        trackPageview(to?.url.href)
    })

    $effect(() => {
        if (!page.url.pathname.includes('/examples/')) {
            $selectedExample = undefined
        }
    })

    function getVisitType(): string {
        const code = page.params.code
        if (code) {
            if (code === 'local') return 'local_page'

            const repository: RepositoryModel = RepositoryService.decode(code)
            if (repository.url === 'danielschuetz/maniok') return 'example_page'
            else if (page.error) return 'custom_page_failed'
            else return 'custom_page_succeeded'
        }

        const id = page.params.id
        if (id) {
            if (page.error) return 'example_page_failed'
            else return `example_page_${id}`
        }

        return 'root'
    }

    onMount(() => {
        import('@plausible-analytics/tracker').then(({ init, track }) => {
            init({
                domain: 'app.maniok.io',
                outboundLinks: true,
                autoCapturePageviews: false,
                customProperties: (eventName): CustomProperties => {
                    if (eventName === 'pageview') {
                        return {
                            type: getVisitType()
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
    })

    let { children }: LayoutProps = $props()
</script>

<div class="flex min-h-screen flex-col">
    <div class="flex-1">
        {@render children()}
    </div>

    <footer class="flex justify-center px-4 py-1">
        <a class="a underline" href="/privacy">Privacy Policy</a>
    </footer>
</div>

<Toaster toaster={NotificationService.getToasterInstance()} />
