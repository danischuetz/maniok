<script lang="ts">
    import { Mode } from '../../model/navigation/mode'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'

    interface Props {
        class?: string
        html: string
    }

    let { class: className, html }: Props = $props()
</script>

<ModeWrapper mode={Mode.Documentation} class="markdown-body w-full h-full {className}">
    {@html html}
</ModeWrapper>
