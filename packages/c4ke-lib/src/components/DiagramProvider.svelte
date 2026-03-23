<script lang="ts">
    import { setContext, type Snippet } from 'svelte'
    import { type DiagramModel } from '../model/diagram/diagrammodel'
    import { diagrams } from '../state/diagrams'

    interface Props {
        diagrams: DiagramModel[]
        children?: Snippet
    }

    let { diagrams: clientDiagrams, children }: Props = $props()

    $effect(() => {
        diagrams.set(clientDiagrams)
    })
</script>

{@render children?.()}
