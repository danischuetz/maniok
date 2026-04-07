<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import type {
        ModeEnum,
        NavigationContextModel
    } from '../../../model/navigation/navigationcontext'

    interface Props {
        mode: ModeEnum
        children: Snippet
    }

    const { mode, children }: Props = $props()
    let navigationContext: NavigationContextModel = $derived(getContext('navigationContext'))
</script>

{#if navigationContext.mode === mode}
    {@render children()}
{/if}
