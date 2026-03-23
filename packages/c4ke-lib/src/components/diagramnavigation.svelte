<script lang="ts">
    import { type DiagramModel } from '../model/diagram/diagrammodel'
    import { DiagramType } from '../model/diagram/diagramtype'
    import { diagrams, selectedDiagram } from '../state/diagrams'

    interface Props {
        class?: string
    }

    let { class: className = '' }: Props = $props()

    let systemContextDiagrams = $derived(
        $diagrams.filter((d) => d.type === DiagramType.SystemContextDiagram)
    )

    let containerDiagrams = $derived(
        $diagrams.filter((d) => d.type === DiagramType.ContainerDiagram)
    )

    let componentDiagrams = $derived(
        $diagrams.filter((d) => d.type === DiagramType.ComponentDiagram)
    )
</script>

{#snippet group(diagrams: DiagramModel[], kind: string)}
    <ul>
        {#each diagrams as diagram (diagram.id)}
            <li>
                {#if diagram === $selectedDiagram}
                    <p class="nav-selected">{kind}: {diagram.title}</p>
                {:else}
                    <button class="nav-selectable" onclick={() => selectedDiagram.set(diagram)}>
                        {kind}:
                        {diagram.title}
                    </button>
                {/if}
            </li>
        {/each}
    </ul>
{/snippet}

<nav class="flex flex-col nav-container {className}">
    <ul>
        <li class="flex flex-col">
            <p class="nav-category">System Context Views</p>
            {@render group(systemContextDiagrams, 'Software System')}
        </li>
        <li class="flex flex-col">
            <p class="nav-category">Container Views</p>
            {@render group(containerDiagrams, 'Software System')}
        </li>
        <li class="flex flex-col">
            <p class="nav-category">Component Views</p>
            {@render group(componentDiagrams, 'Container')}
        </li>
    </ul>
</nav>
