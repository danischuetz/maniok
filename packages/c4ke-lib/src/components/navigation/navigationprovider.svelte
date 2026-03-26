<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import { ModeEnum, type ModeContextModel } from '../../model/navigation/mode'

    interface Props {
        children: Snippet
    }

    let { children }: Props = $props()

    let modeContext: ModeContextModel = $state({ mode: ModeEnum.Documentation })
    setContext('mode', modeContext)
</script>

{@render children()}
