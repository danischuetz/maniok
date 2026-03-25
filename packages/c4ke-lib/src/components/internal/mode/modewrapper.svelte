<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import type { Mode, ModeContext } from '../../../model/navigation/mode'

    interface Props {
        mode: Mode
        children: Snippet
    }

    const { mode, children }: Props = $props()
    let modeContext: ModeContext = $derived(getContext('mode'))
</script>

{#if modeContext.mode === mode}
    {@render children()}
{/if}
