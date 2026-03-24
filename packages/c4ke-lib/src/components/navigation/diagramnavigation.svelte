<script lang="ts">
    import { type DiagramModel } from '../../model/diagram/diagrammodel'
    import { DiagramType } from '../../model/diagram/diagramtype'

    interface Props {
        class?: string
        diagrams: DiagramModel[]
        selectedDiagram: DiagramModel | null
    }

    let { class: className = '', diagrams, selectedDiagram = $bindable() }: Props = $props()

    let systemContextDiagrams = $derived(
        diagrams.filter((d) => d.type === DiagramType.SystemContextDiagram)
    )

    let containerDiagrams = $derived(
        diagrams.filter((d) => d.type === DiagramType.ContainerDiagram)
    )

    let componentDiagrams = $derived(
        diagrams.filter((d) => d.type === DiagramType.ComponentDiagram)
    )
</script>

{#snippet group(diagrams: DiagramModel[], kind: string)}
    <ul>
        {#each diagrams as diagram (diagram.id)}
            <li>
                {#if diagram === selectedDiagram}
                    <p class="diagram-nav-selected">{kind}: {diagram.title}</p>
                {:else}
                    <button
                        class="diagram-nav-selectable"
                        onclick={() => (selectedDiagram = diagram)}
                    >
                        {kind}:
                        {diagram.title}
                    </button>
                {/if}
            </li>
        {/each}
    </ul>
{/snippet}

<ul class="flex flex-col diagram-nav-container {className}">
    <li class="flex flex-col">
        <p class="diagram-nav-category">System Context Views</p>
        {@render group(systemContextDiagrams, 'Software System')}
    </li>
    <li class="flex flex-col">
        <p class="diagram-nav-category">Container Views</p>
        {@render group(containerDiagrams, 'Software System')}
    </li>
    <li class="flex flex-col">
        <p class="diagram-nav-category">Component Views</p>
        {@render group(componentDiagrams, 'Container')}
    </li>
</ul>
