<script lang="ts">
    import { page } from '$app/state'
    import { goto } from '$app/navigation'
    import { NotificationService } from 'maniok-core'
    import { onMount } from 'svelte'

    onMount(async () => {
        const { track } = await import('@plausible-analytics/tracker')
        const isExampleDocumentation: boolean =
            page.params.code === 'local' ||
            page.params.code === 'Z2l0aHViOmRhbmlzY2h1ZXR6L21hbmlvaw'

        track('Failed to visit documentation', {
            props: {
                type: isExampleDocumentation ? 'example' : 'custom'
            }
        })

        NotificationService.notifyError('Failed to load repository', new Error(page.error?.message))
        goto('/')
    })
</script>
