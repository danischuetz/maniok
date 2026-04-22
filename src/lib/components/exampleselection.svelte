<script lang="ts">
    import Selectable from '$lib/components/utilities/selectable.svelte'
    import { examples, selectedExample } from '$lib/state/examplepage'
</script>

<div class="flex items-start md:items-center gap-2 p-1 flex-col md:flex-row">
    <Selectable selectables={examples} bind:selected={$selectedExample} placeholder="Examples" />
</div>
