<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte'

    let { width, height }: NodeProps = $props()

    // let metaData: NodeMetaData = $derived(data.metaData as NodeMetaData)
</script>

<div
    class="absolute flex flex-col justify-end items-start cgroup-container"
    style="width: {width}px; height: {height}px;"
    role="group"
></div>
