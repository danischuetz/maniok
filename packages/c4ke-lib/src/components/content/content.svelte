<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import type { NavigationContextModel } from '../../model/navigation/navigationcontext'

    interface Props {
        class?: string
        children: Snippet
    }

    let { class: className, children }: Props = $props()
    let navigationContext: NavigationContextModel = $derived(getContext('navigationContext'))
</script>

<div class="content overflow-auto {className}">
    {@render children()}
</div>
