<script lang="ts">
    import { getContext } from 'svelte'
    import type { DocumentNodeModel } from '../../model/documentation/documentnode'
    import type { HeadingModel } from '../../model/documentation/heading'
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

    interface HeadingNode {
        heading: HeadingModel
        children: HeadingNode[]
    }

    function buildHeadingTree(headings: HeadingModel[]): HeadingNode[] {
        const root: HeadingNode = { heading: { id: 'root', text: '', depth: 0 }, children: [] }
        const stack: HeadingNode[] = [root]

        for (const heading of headings) {
            while (stack.length > 1 && heading.depth <= stack[stack.length - 1].heading.depth) {
                stack.pop()
            }
            const newNode: HeadingNode = { heading, children: [] }
            stack[stack.length - 1].children.push(newNode)
            stack.push(newNode)
        }

        return root.children
    }
</script>

{#snippet headings(headingNodes: HeadingNode[], node: DocumentNodeModel)}
    <ul>
        {#each headingNodes as headingNode (headingNode.heading.id)}
            {@const heading = headingNode.heading}
            <li>
                <a
                    onclick={(e) => {
                        e.preventDefault()
                        documentationContext.selectedDocumentNode = node
                        documentationContext.content = node.documentation
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                        navigationContext.onNavigation()
                    }}
                    href={'#' + heading.id}
                    class:active={documentationContext.activeHeadingId === heading.id}
                >
                    {heading.text}
                </a>
            </li>
            {#if headingNode.children.length > 0}
                {@render headings(headingNode.children, node)}
            {/if}
        {/each}
    </ul>
{/snippet}

{#snippet node(nodeModel: DocumentNodeModel)}
    <ul class="flex flex-col node">
        <p>
            {nodeModel.type ? `${nodeModel.type}: ${nodeModel.name}` : nodeModel.name}
        </p>
        {#if nodeModel.documentation?.headings}
            {@render headings(buildHeadingTree(nodeModel.documentation.headings), nodeModel)}
        {/if}
    </ul>
{/snippet}

{#snippet subTree(root: DocumentNodeModel)}
    {#if root.children && root.children.length > 0}
        <ul class="flex flex-col items-start">
            {#each root.children as child (child.id)}
                <li>
                    {@render node(child)}
                    {@render subTree(child)}
                </li>
            {/each}
        </ul>
    {/if}
{/snippet}

<Modewrapper mode={ModeEnum.Documentation}>
    {#if documentationContext.documentRoot}
        <nav class="flex flex-col items-start document-tree {className}">
            {@render node(documentationContext.documentRoot)}
            {@render subTree(documentationContext.documentRoot)}
        </nav>
    {/if}
</Modewrapper>
