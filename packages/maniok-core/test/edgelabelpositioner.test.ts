import { describe, expect, it } from 'vitest'
import { type Edge, type Node, Position, getBezierPath } from '@xyflow/svelte'
import { EdgeLabelPositioner } from '../src/service/xyflow/edgelabelpositioner'
import type { ConnectionModel } from '../src/model/diagram/connection'

type Rect = { x: number; y: number; width: number; height: number }

const EDGE_LABEL_MAX_WIDTH = 112
const EDGE_LABEL_CHAR_WIDTH = 6
const EDGE_LABEL_LINE_HEIGHT = 16
const EDGE_LABEL_HORIZONTAL_INSET = 6
const EDGE_LABEL_VERTICAL_INSET = 6

function createNode(params: {
    id: string
    x: number
    y: number
    width: number
    height: number
    parentId?: string
    type?: string
    connections?: ConnectionModel[]
}): Node {
    return {
        id: params.id,
        type: params.type ?? 'element',
        parentId: params.parentId,
        position: { x: params.x, y: params.y },
        width: params.width,
        height: params.height,
        data: {
            connections: params.connections ?? []
        }
    }
}

function createEdge(params: {
    id: string
    source: string
    target: string
    sourceHandle: string
    targetHandle: string
    label: string
}): Edge {
    return {
        id: params.id,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        label: params.label,
        data: {},
        type: 'custom'
    }
}

function estimateLabelRect(x: number, y: number, label: string): Rect {
    const charactersPerLine = Math.max(
        1,
        Math.floor((EDGE_LABEL_MAX_WIDTH - EDGE_LABEL_HORIZONTAL_INSET) / EDGE_LABEL_CHAR_WIDTH)
    )
    const labelLength = label.trim().length
    const lineCount = Math.max(1, Math.ceil(labelLength / charactersPerLine))
    const width = Math.min(
        EDGE_LABEL_MAX_WIDTH,
        Math.max(0, Math.min(labelLength, charactersPerLine) * EDGE_LABEL_CHAR_WIDTH + EDGE_LABEL_HORIZONTAL_INSET)
    )
    const height = lineCount * EDGE_LABEL_LINE_HEIGHT + EDGE_LABEL_VERTICAL_INSET

    return {
        x: x - width / 2,
        y: y - height / 2,
        width,
        height
    }
}

function rectanglesOverlap(left: Rect, right: Rect): boolean {
    return !(
        left.x + left.width <= right.x ||
        right.x + right.width <= left.x ||
        left.y + left.height <= right.y ||
        right.y + right.height <= left.y
    )
}

function createSimpleLeftRightNodes(): Node[] {
    return [
        createNode({
            id: 'source',
            x: 0,
            y: 0,
            width: 100,
            height: 60,
            connections: [{ id: 'source-0', position: Position.Right, type: 'source' }]
        }),
        createNode({
            id: 'target',
            x: 300,
            y: 0,
            width: 100,
            height: 60,
            connections: [{ id: 'target-0', position: Position.Left, type: 'target' }]
        })
    ]
}

describe('EdgeLabelPositioner', () => {
    it('keeps the bezier midpoint when there is no collision', () => {
        const nodes = createSimpleLeftRightNodes()
        const edge = createEdge({
            id: 'edge-1',
            source: 'source',
            target: 'target',
            sourceHandle: 'source-0',
            targetHandle: 'target-0',
            label: 'uses'
        })

        const [_, midpointX, midpointY] = getBezierPath({
            sourceX: 100,
            sourceY: 30,
            sourcePosition: Position.Right,
            targetX: 300,
            targetY: 30,
            targetPosition: Position.Left
        })

        const [positioned] = EdgeLabelPositioner.positionLabels(nodes, [edge])

        expect((positioned.data as { labelX?: number }).labelX).toBeCloseTo(midpointX)
        expect((positioned.data as { labelY?: number }).labelY).toBeCloseTo(midpointY)
    })

    it('avoids node overlap when the midpoint collides with a node', () => {
        const nodes = [
            ...createSimpleLeftRightNodes(),
            createNode({ id: 'blocker', x: 170, y: 8, width: 70, height: 44 })
        ]
        const [positioned] = EdgeLabelPositioner.positionLabels(
            nodes,
            [
                createEdge({
                    id: 'edge-1',
                    source: 'source',
                    target: 'target',
                    sourceHandle: 'source-0',
                    targetHandle: 'target-0',
                    label: 'reads and writes data'
                })
            ]
        )

        const labelX = (positioned.data as { labelX: number }).labelX
        const labelY = (positioned.data as { labelY: number }).labelY
        const labelRect = estimateLabelRect(labelX, labelY, String(positioned.label ?? ''))
        const blockerRect: Rect = { x: 170, y: 8, width: 70, height: 44 }

        expect(rectanglesOverlap(labelRect, blockerRect)).toBe(false)
    })

    it('avoids collision with an already placed edge label', () => {
        const nodes = createSimpleLeftRightNodes()
        const edges = [
            createEdge({
                id: 'edge-1',
                source: 'source',
                target: 'target',
                sourceHandle: 'source-0',
                targetHandle: 'target-0',
                label: 'first label'
            }),
            createEdge({
                id: 'edge-2',
                source: 'source',
                target: 'target',
                sourceHandle: 'source-0',
                targetHandle: 'target-0',
                label: 'second label'
            })
        ]

        const [first, second] = EdgeLabelPositioner.positionLabels(nodes, edges)

        const firstRect = estimateLabelRect(
            (first.data as { labelX: number }).labelX,
            (first.data as { labelY: number }).labelY,
            String(first.label ?? '')
        )
        const secondRect = estimateLabelRect(
            (second.data as { labelX: number }).labelX,
            (second.data as { labelY: number }).labelY,
            String(second.label ?? '')
        )

        expect(rectanglesOverlap(firstRect, secondRect)).toBe(false)
    })

    it('accounts for nested node positions when avoiding overlap', () => {
        const nodes = [
            ...createSimpleLeftRightNodes(),
            createNode({ id: 'group', x: 150, y: 0, width: 140, height: 80, type: 'group' }),
            createNode({
                id: 'nested-blocker',
                x: 20,
                y: 8,
                width: 80,
                height: 44,
                parentId: 'group'
            })
        ]

        const [positioned] = EdgeLabelPositioner.positionLabels(
            nodes,
            [
                createEdge({
                    id: 'edge-1',
                    source: 'source',
                    target: 'target',
                    sourceHandle: 'source-0',
                    targetHandle: 'target-0',
                    label: 'observes'
                })
            ]
        )

        const labelRect = estimateLabelRect(
            (positioned.data as { labelX: number }).labelX,
            (positioned.data as { labelY: number }).labelY,
            String(positioned.label ?? '')
        )
        const nestedBlockerAbsoluteRect: Rect = { x: 170, y: 8, width: 80, height: 44 }

        expect(rectanglesOverlap(labelRect, nestedBlockerAbsoluteRect)).toBe(false)
    })
})
