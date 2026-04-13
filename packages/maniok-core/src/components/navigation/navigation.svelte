<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import type { NavigationContextModel } from '../../model/navigation/navigationcontext'

    interface Props {
        class?: string
        children: Snippet
        onNavigation: () => void
    }

    let { class: className, children, onNavigation }: Props = $props()

    let navigationContext: NavigationContextModel = $state({
        onNavigation: () => {}
    })

    $effect(() => {
        navigationContext.onNavigation = onNavigation
    })

    setContext('navigationContext', navigationContext)
</script>

<div class="flex {className}">
    {@render children()}
</div>
