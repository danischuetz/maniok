<script lang="ts">
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import { ModeEnum } from '../../model/navigation/navigationcontext'
    import Diagram from '../internal/diagram/diagram.svelte'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'
    interface Props {
        diagram?: DiagramModel | null
        class?: string
    }

    let { class: className, diagram }: Props = $props()
</script>

<ModeWrapper mode={ModeEnum.Diagrams}>
    <Diagram class="w-full h-full {className}" {diagram} />
</ModeWrapper>
