<script lang="ts">
    import { getContext } from 'svelte'
    import { type DiagramModel } from '../../model/diagram/diagrammodel'
    import { DiagramTypeModel } from '../../model/diagram/diagramtype'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'
    import Modewrapper from '../internal/mode/modewrapper.svelte'

    interface Props {
        class?: string
    }

    let { class: className = '' }: Props = $props()

    let navigationContext: NavigationContextModel = getContext('navigationContext')

    let systemContextDiagrams = $derived(
        navigationContext.diagrams.filter((d) => d.type === DiagramTypeModel.SystemContextDiagram)
    )

    let containerDiagrams = $derived(
        navigationContext.diagrams.filter((d) => d.type === DiagramTypeModel.ContainerDiagram)
    )

    let componentDiagrams = $derived(
        navigationContext.diagrams.filter((d) => d.type === DiagramTypeModel.ComponentDiagram)
    )
</script>

{#snippet group(diagrams: DiagramModel[], kind: string)}
    <ul>
        {#each diagrams as diagram (diagram.id)}
            <li>
                {#if diagram.id === navigationContext.selectedDiagram?.id}
                    <p class="diagram-nav-selected">{kind}: {diagram.title}</p>
                {:else}
                    <button
                        class="diagram-nav-selectable"
                        onclick={() => (navigationContext.selectedDiagram = diagram)}
                    >
                        {kind}:
                        {diagram.title}
                    </button>
                {/if}
            </li>
        {/each}
    </ul>
{/snippet}

<Modewrapper mode={ModeEnum.Diagrams}>
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
</Modewrapper>
