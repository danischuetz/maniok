<script lang="ts">
    import Selectable from '$lib/components/utilities/selectable.svelte'
    import { examples, selectedExample } from '$lib/state/examplepage'
    import type { NavigationContextModel } from 'maniok-core'
    import { getContext } from 'svelte'

    let navigationContext: NavigationContextModel | undefined = getContext('navigationContext')
    selectedExample.subscribe(() => {
        navigationContext?.onNavigation()
    })
</script>

<div class="flex items-start md:items-center gap-2 flex-col md:flex-row">
    <Selectable selectables={examples} bind:selected={$selectedExample} placeholder="Examples" />
</div>
