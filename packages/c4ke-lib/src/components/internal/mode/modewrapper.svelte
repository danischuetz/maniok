<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import type { ModeEnum, ModeContextModel } from '../../../model/navigation/mode'

    interface Props {
        mode: ModeEnum
        children: Snippet
    }

    const { mode, children }: Props = $props()
    let modeContext: ModeContextModel = $derived(getContext('mode'))
</script>

{#if modeContext.mode === mode}
    {@render children()}
{/if}
