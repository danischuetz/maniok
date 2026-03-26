<script lang="ts">
    import { getContext } from 'svelte'
    import type { DocumentNodeModel } from '../../model/documentation/documentnode'
    import type { HeadingModel } from '../../model/documentation/heading'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'
    import Modewrapper from '../internal/mode/modewrapper.svelte'

    interface Props {
        class?: string
        documentRoot: DocumentNodeModel
        selectedDocumentNode: DocumentNodeModel | undefined
    }

    let {
        class: className = '',
        documentRoot,
        selectedDocumentNode = $bindable()
    }: Props = $props()

    let navigationContext: NavigationContextModel = getContext('navigationContext')
</script>

{#snippet headings(headingList: HeadingModel[], node: DocumentNodeModel, headingDepth: number)}
    {@const levelHeadings = headingList.filter((heading) => heading.depth === headingDepth)}
    {@const nextLevelHeadings = headingList.filter((heading) => heading.depth === headingDepth + 1)}
    <ul>
        {#each levelHeadings as heading (heading.id)}
            {#if heading.depth === headingDepth}
                <li>
                    <a
                        onclick={(e) => {
                            e.preventDefault()
                            selectedDocumentNode = node
                            document
                                .getElementById(heading.id)
                                ?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        href={'#' + heading.id}
                        class:active={navigationContext.activeHeadingId === heading.id}
                    >
                        {heading.text}
                    </a>
                </li>
            {/if}
        {/each}
        {#if nextLevelHeadings.length > 0}
            {@render headings(headingList, node, headingDepth + 1)}
        {/if}
    </ul>
{/snippet}

{#snippet node(nodeModel: DocumentNodeModel, level: number)}
    <ul class="flex flex-col node">
        <p>{nodeModel.type ? `${nodeModel.type}: ${nodeModel.name}` : nodeModel.name}</p>
        {#if nodeModel.documentation?.headings}
            {@render headings(nodeModel.documentation.headings, nodeModel, 0)}
        {/if}
    </ul>
{/snippet}

{#snippet subTree(root: DocumentNodeModel, level: number)}
    {#if root.children && root.children.length > 0}
        <ul class="flex flex-col items-start">
            {#each root.children as child (child.id)}
                <li>
                    {@render node(child, level)}
                    {@render subTree(child, level + 1)}
                </li>
            {/each}
        </ul>
    {/if}
{/snippet}

<Modewrapper mode={ModeEnum.Documentation}>
    <nav class="flex flex-col items-start document-tree {className}">
        {@render node(documentRoot, 0)}
        {@render subTree(documentRoot, 1)}
    </nav>
</Modewrapper>
