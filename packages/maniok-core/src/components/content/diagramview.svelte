<script lang="ts">
    import { getContext } from 'svelte'
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'
    import Diagram from '../internal/diagram/diagram.svelte'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'
    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()

    let navigationContext: NavigationContextModel = getContext('navigationContext')
</script>

<ModeWrapper mode={ModeEnum.Diagrams}>
    <Diagram class="w-full h-full {className}" diagram={navigationContext.selectedDiagram} />
</ModeWrapper>
