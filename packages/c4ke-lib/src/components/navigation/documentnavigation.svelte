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
</script>

{#snippet headings(node: DocumentNodeModel)}
    {#if node.documentation?.headings}
        <ul>
            {#each node.documentation.headings as heading (heading.id)}
                <li>
                    <a onclick={() => (selectedDocumentNode = node)} href={'#' + heading.id}
                        >{heading.text}</a
                    >
                </li>
            {/each}
        </ul>
    {/if}
{/snippet}

{#snippet entry(node: DocumentNodeModel)}
    <div class="flex flex-col items-start document-node">
        <p>{node.type ? `${node.type}: ${node.name}` : node.name}</p>
        {@render headings(node)}
    </div>
{/snippet}

{#snippet subTree(root: DocumentNodeModel)}
    {#if root.children && root.children.length > 0}
        <ul>
            {#each root.children as child (child.id)}
                <li>
                    {@render entry(child)}
                    {@render subTree(child)}
                </li>
            {/each}
        </ul>
    {/if}
{/snippet}

<Modewrapper mode={ModeEnum.Documentation}>
    <nav class="document-tree">
        {@render subTree(documentRoot)}
    </nav>
</Modewrapper>
