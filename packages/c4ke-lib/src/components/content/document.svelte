<script lang="ts">
    import { ModeEnum } from '../../model/navigation/mode'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'

    interface Props {
        class?: string
        html?: string
    }

    let { class: className, html }: Props = $props()
</script>

<ModeWrapper mode={ModeEnum.Documentation}>
    {#if !html}
        <p>No content available.</p>
    {:else}
        <article class="markdown-body w-full h-full {className}">
            {@html html}
        </article>
    {/if}
</ModeWrapper>
