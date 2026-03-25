<script lang="ts">
    import type { DocumentNode } from '../../model/documentation/documentnode'
    import { Mode } from '../../model/navigation/mode'
    import Modewrapper from '../internal/mode/modewrapper.svelte'

    interface Props {
        class?: string
        documentRoot: DocumentNode
        selectedDocumentNode: DocumentNode
    }

    let {
        class: className = '',
        documentRoot,
        selectedDocumentNode = $bindable()
    }: Props = $props()
</script>

{#snippet entry(node: DocumentNode)}
    {@const displayName = node.type ? `${node.type}: ${node.name}` : node.name}
    {#if node.html}
        <button onclick={() => (selectedDocumentNode = node)}>{displayName}</button>
    {:else}
        <p>{displayName}</p>
    {/if}
{/snippet}

{#snippet subTree(root: DocumentNode)}
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

<!-- {#if diagram === selectedDiagram}
    <p class="diagram-nav-selected">{kind}: {diagram.title}</p>
{:else}
    <button
        class="diagram-nav-selectable"
        onclick={() => (selectedDiagram = diagram)}
    >
        {kind}:
        {diagram.title}
    </button>
{/if} -->

<Modewrapper mode={Mode.Documentation}>
    <nav class="document-tree">
        {@render entry(documentRoot)}
        {@render subTree(documentRoot)}
    </nav>
</Modewrapper>
