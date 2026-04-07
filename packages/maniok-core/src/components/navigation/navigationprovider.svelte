<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'

    interface Props {
        children: Snippet
    }

    let { children }: Props = $props()

    let navigationContext: NavigationContextModel = $state({
        mode: ModeEnum.Documentation,
        activeHeadingId: undefined,
        diagramFocusId: undefined
    })
    setContext('navigationContext', navigationContext)
</script>

{@render children()}
