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

    let isReverseEdge: boolean = $derived.by(() => {
        if (!data) return false
        return (data.isReverseEdge as boolean) ?? false
    })
</script>

<BaseEdge
    class={isReverseEdge ? 'edge edge-reverse' : 'edge'}
    path={edgePath}
    {markerStart}
    {markerEnd}
/>
<EdgeLabel
    class={isReverseEdge ? 'edge-label edge-label-reverse' : 'edge-label'}
    x={labelX}
    y={labelY}>{label}</EdgeLabel
>
