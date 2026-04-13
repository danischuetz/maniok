<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import type {
        ModeEnum,
        DocumentationContextModel
    } from '../../../model/documentation/documentationcontext'

    interface Props {
        mode: ModeEnum
        children: Snippet
    }

    const { mode, children }: Props = $props()
    let documentationContext: DocumentationContextModel = $derived(
        getContext('documentationContext')
    )
</script>

{#if documentationContext.mode === mode}
    {@render children()}
{/if}
