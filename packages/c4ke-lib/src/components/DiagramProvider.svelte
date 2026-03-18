<script lang="ts">
    import { setContext, type Snippet } from "svelte"
    import { type DiagramModel } from "../model/diagram/diagrammodel"

    interface Props {
        diagrams: DiagramModel[]
        children?: Snippet
    }

    let { diagrams, children }: Props = $props()

    setContext("diagrams", () => diagrams)
    setContext("selectedDiagramIndex", 0)
</script>

{@render children?.()}
