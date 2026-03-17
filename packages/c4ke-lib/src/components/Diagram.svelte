<script lang="ts">
    import { getContext } from "svelte";
    import { DiagramModel } from "../model/diagrammodel";

    interface Props {
        class: string;
    }

    let { class: className }: Props = $props();

    const diagrams: DiagramModel[] = getContext("diagrams");
    const selectedDiagramIndex: number = getContext("selectedDiagramIndex");

    const selectedDiagram: DiagramModel | undefined =
        diagrams.length > selectedDiagramIndex
            ? diagrams[selectedDiagramIndex]
            : undefined;
</script>

<div class="flex justify-center items-center {className}">
    {#if !selectedDiagram}
        <h1 class="text-gray-500">No diagram selected</h1>
    {:else}
        <h2>{selectedDiagram.title}</h2>
        <p>{selectedDiagram.description}</p>
    {/if}
</div>
