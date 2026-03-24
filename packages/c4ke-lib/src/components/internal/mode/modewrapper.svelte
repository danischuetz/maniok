<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import type { Mode, ModeContext } from '../../../model/navigation/mode'

    interface Props {
        class?: string
        mode: Mode
        children: Snippet
    }

    const { class: className = '', mode, children }: Props = $props()

    let modeContext: ModeContext = $derived(getContext('mode'))

    $inspect(modeContext)
</script>

{#if modeContext.mode === mode}
    {@render children()}
{/if}
