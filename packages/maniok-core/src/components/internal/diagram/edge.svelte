<script lang="ts">
    import { getBezierPath, BaseEdge, EdgeLabel, type EdgeProps } from '@xyflow/svelte'

    let {
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        data,
        label,
        markerStart,
        markerEnd
    }: EdgeProps = $props()

    let [edgePath, labelX, labelY] = $derived(
        getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition
        })
    )
</script>

<BaseEdge path={edgePath} {markerStart} {markerEnd} />
<EdgeLabel class="edge-label" x={labelX} y={labelY}>{label}</EdgeLabel>
