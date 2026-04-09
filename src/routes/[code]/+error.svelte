<script lang="ts">
    import { page } from '$app/state'
    import { goto } from '$app/navigation'
    import { NotificationService } from 'maniok-core'

    $effect(() => {
        NotificationService.notifyError('Failed to load repository', new Error(page.error?.message))
        goto('/')
    })
</script>
