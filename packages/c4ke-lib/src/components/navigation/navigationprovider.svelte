<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import { Mode, type ModeContext } from '../../model/navigation/mode'

    interface Props {
        children: Snippet
    }

    let { children }: Props = $props()

    let modeContext: ModeContext = $state({ mode: Mode.Diagrams })
    setContext('mode', modeContext)
</script>

{@render children()}
