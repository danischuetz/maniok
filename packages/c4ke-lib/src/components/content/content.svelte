<script lang="ts">
    import { type Snippet } from 'svelte'

    interface Props {
        class?: string
        children: Snippet
    }

    let { class: className, children }: Props = $props()
</script>

<div class="content {className}">
    {@render children()}
</div>
