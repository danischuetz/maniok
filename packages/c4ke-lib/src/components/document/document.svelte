<script lang="ts">
    interface Props {
        class?: string
        html: string
    }

    let { class: className, html }: Props = $props()
</script>

<div class="markdown-body {className}">
    {@html html}
</div>
