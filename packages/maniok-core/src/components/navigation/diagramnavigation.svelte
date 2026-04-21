<script lang="ts">
    import { getContext } from 'svelte'
    import { type DiagramModel } from '../../model/diagram/diagrammodel'
    import { DiagramTypeModel } from '../../model/diagram/diagramtype'
    import {
        ModeEnum,
        type DocumentationContextModel
    } from '../../model/documentation/documentationcontext'
    import Modewrapper from '../internal/mode/modewrapper.svelte'
    import type { NavigationContextModel } from '../../model/navigation/navigationcontext'

    interface Props {
        class?: string
    }

    let { class: className = '' }: Props = $props()

    let documentationContext: DocumentationContextModel = getContext('documentationContext')
    let navigationContext: NavigationContextModel = getContext('navigationContext')

    let systemContextDiagrams = $derived(
        documentationContext.diagrams.filter(
            (d) => d.type === DiagramTypeModel.SystemContextDiagram
        )
    )

    let containerDiagrams = $derived(
        documentationContext.diagrams.filter((d) => d.type === DiagramTypeModel.ContainerDiagram)
    )

    let componentDiagrams = $derived(
        documentationContext.diagrams.filter((d) => d.type === DiagramTypeModel.ComponentDiagram)
    )
</script>

{#snippet group(diagrams: DiagramModel[], kind: string)}
    <ul>
        {#each diagrams as diagram (diagram.id)}
            <li>
                {#if diagram.id === documentationContext.selectedDiagram?.id}
                    <p class="diagram-nav-selected">{diagram.title}</p>
                {:else}
                    <button
                        class="diagram-nav-selectable"
                        onclick={() => {
                            documentationContext.selectedDiagram = diagram
                            navigationContext.onNavigation()
                        }}
                    >
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
