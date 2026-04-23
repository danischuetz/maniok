<script lang="ts">
    import Selectable from '$lib/components/utilities/selectable.svelte'
    import { examples, selectedExample } from '$lib/state/examplepage'
    import type { NavigationContextModel } from 'maniok-core'
    import { getContext } from 'svelte'

    interface Props {
        showAI?: boolean
    }

    let { showAI = false }: Props = $props()

    let navigationContext: NavigationContextModel | undefined = getContext('navigationContext')
    selectedExample.subscribe(() => {
        navigationContext?.onNavigation()
    })
</script>

<div class="flex flex-col">
    <Selectable selectables={examples} bind:selected={$selectedExample} placeholder="Examples" />
    {#if showAI}
        <p class="text-xs text-surface-700-300">(AI-generated)</p>
    {/if}
</div>
