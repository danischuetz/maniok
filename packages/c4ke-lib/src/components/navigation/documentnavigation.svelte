<script lang="ts">
    import type { DocumentNodeModel } from '../../model/documentation/documentnode'
    import { ModeEnum } from '../../model/navigation/mode'
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

    let activeHeadingId: string | undefined = $state(undefined)

    $effect(() => {
        selectedDocumentNode

        const observedHeadings: HTMLElement[] = Array.from(
            document.querySelectorAll('[id]')
        ) as HTMLElement[]

        let intersectingHeadingIds: Set<string> = $state(new Set())

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) intersectingHeadingIds.add(entry.target.id)
                    else intersectingHeadingIds.delete(entry.target.id)
                }
                activeHeadingId =
                    intersectingHeadingIds.size > 0
                        ? observedHeadings
                              .map((el) => el.id)
                              .find((id) => intersectingHeadingIds.has(id))
                        : undefined
            },
            { rootMargin: '-3% 0px -20% 0px' }
        )

        observedHeadings.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    })
</script>

{#snippet headings(node: DocumentNodeModel)}
    {#if node.documentation?.headings}
        <ul>
            {#each node.documentation.headings as heading (heading.id)}
                <li>
                    <a
                        onclick={() => (selectedDocumentNode = node)}
                        href={'#' + heading.id}
                        class:active={activeHeadingId === heading.id}
                    >
                        {heading.text}
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
{/snippet}

{#snippet node(nodeModel: DocumentNodeModel, level: number)}
    <ul class="flex flex-col node-level-{level}">
        <p>{nodeModel.type ? `${nodeModel.type}: ${nodeModel.name}` : nodeModel.name}</p>
        {@render headings(nodeModel)}
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
