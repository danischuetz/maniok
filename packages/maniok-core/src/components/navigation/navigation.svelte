<script lang="ts">
    import { type Snippet } from 'svelte'

    interface Props {
        class?: string
        children: Snippet
        onNavigation: () => void
    }

    let { class: className, children, onNavigation }: Props = $props()
</script>

<div class="flex {className}">
    {@render children()}
</div>
