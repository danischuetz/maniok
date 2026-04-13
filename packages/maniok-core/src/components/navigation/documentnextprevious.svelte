<script lang="ts">
    import { getContext } from 'svelte'
    import { type DocumentationContextModel } from '../../model/documentation/documentationcontext'
    import { ArrowLeft, ArrowRight } from 'lucide-svelte'
    import type { DocumentNodeModel } from '../../../dist'

    interface Props {
        class?: string
    }

    let { class: className = '' }: Props = $props()

    let documentationContext: DocumentationContextModel = getContext('documentationContext')

    function flatten(node: DocumentNodeModel): DocumentNodeModel[] {
        return [node, ...(node.children?.flatMap(flatten) ?? [])]
    }

    let flatNodes = $derived.by(() => {
        if (!documentationContext.documentRoot) return []
        return flatten(documentationContext.documentRoot)
    })

    let previousDocumentNode: DocumentNodeModel | undefined = $derived.by(() => {
        if (!flatNodes) return undefined
        const index = flatNodes.findIndex(
            (node) => node.id === documentationContext.selectedDocumentNode?.id
        )
        if (index === undefined || index <= 0) return undefined
        return flatNodes[index - 1]
    })

    let nextDocumentNode: DocumentNodeModel | undefined = $derived.by(() => {
        if (!flatNodes) return undefined
        const index = flatNodes.findIndex(
            (node) => node.id === documentationContext.selectedDocumentNode?.id
        )
        if (index === undefined || index < 0 || index >= flatNodes.length - 1) return undefined
        return flatNodes[index + 1]
    })

    function toTitle(node: DocumentNodeModel): string {
        return node.type ? `${node.type}: ${node.name}` : node.name
    }

    function loadDocumentNode(node: DocumentNodeModel | undefined) {
        if (!node) return
        documentationContext.selectedDocumentNode = node
        documentationContext.content = node.documentation
    }
</script>

<nav class="grid grid-cols-2 gap-2 next-previous-container {className}">
    {#if previousDocumentNode}
        <button
            class="col-start-1 flex items-center gap-4 next-previous"
            onclick={() => {
                loadDocumentNode(previousDocumentNode)
            }}
        >
            <ArrowLeft />
            <div class="flex-1 flex flex-col items-start gap-1">
                <span class="nextprevious-label">Previous</span>
                <span class="text-left nextprevious-title">{toTitle(previousDocumentNode)}</span>
            </div>
        </button>
    {/if}
    {#if nextDocumentNode}
        <button
            class="col-start-2 flex items-center gap-4 next-previous"
            onclick={() => {
                loadDocumentNode(nextDocumentNode)
            }}
        >
            <div class="flex-1 flex flex-col items-end gap-1">
                <span class="nextprevious-label">Next</span>
                <span class="text-right nextprevious-title">{toTitle(nextDocumentNode)}</span>
            </div>
            <ArrowRight />
        </button>
    {/if}
</nav>
