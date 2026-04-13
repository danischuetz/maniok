<script lang="ts">
    import { getContext } from 'svelte'
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import {
        ModeEnum,
        type DocumentationContextModel
    } from '../../model/documentation/documentationcontext'
    import Diagram from '../internal/diagram/diagram.svelte'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'
    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()

    let documentationContext: DocumentationContextModel = getContext('documentationContext')
</script>

<ModeWrapper mode={ModeEnum.Diagrams}>
    <Diagram class="w-full h-full {className}" diagram={documentationContext.selectedDiagram} />
</ModeWrapper>
