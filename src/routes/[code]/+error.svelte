<script lang="ts">
    import { page } from '$app/state'
    import { goto } from '$app/navigation'
    import { NotificationService } from 'maniok-core'
    import type { PlausibleEventOptions } from '@plausible-analytics/tracker'
    import { onMount } from 'svelte'

    let trackFunction: ((eventName: string, options: PlausibleEventOptions) => void) | undefined =
        undefined

    onMount(async () => {
        const { track } = await import('@plausible-analytics/tracker')
        trackFunction = track
    })

    $effect(() => {
        if (trackFunction !== undefined) {
            const isExampleDocumentation: boolean =
                page.params.code === 'local' ||
                page.params.code === 'Z2l0aHViOmRhbmlzY2h1ZXR6L21hbmlvaw'

            trackFunction('Failed to visit documentation', {
                props: {
                    type: isExampleDocumentation ? 'example' : 'custom'
                }
            })
        }
        NotificationService.notifyError('Failed to load repository', new Error(page.error?.message))
        goto('/')
    })
</script>
