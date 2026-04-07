<script lang="ts">
    import { NotificationService, Toaster } from 'maniok-core'
    import type { LayoutProps } from './$types'

    let { children }: LayoutProps = $props()
</script>

{@render children()}

<Toaster toaster={NotificationService.getToasterInstance()} />
