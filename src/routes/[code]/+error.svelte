<script lang="ts">
    import { page } from '$app/state'
    import { goto } from '$app/navigation'
    import { NotificationService } from 'maniok-core'
    import { onMount } from 'svelte'

    onMount(async () => {
        NotificationService.notifyError('Failed to load repository', new Error(page.error?.message))
        goto('/')
    })
</script>
