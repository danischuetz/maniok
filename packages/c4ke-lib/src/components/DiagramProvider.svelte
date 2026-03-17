<script lang="ts">
    import { setContext, Snippet } from "svelte";
    import { DiagramModel } from "../model/diagrammodel";

    interface Props {
        diagrams: DiagramModel[];
        children?: Snippet;
    }

    let { diagrams, children }: Props = $props();

    setContext("diagrams", () => diagrams);
    setContext("selectedDiagramIndex", 0);
</script>

{@render children?.()}
