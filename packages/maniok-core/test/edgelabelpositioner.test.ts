import { describe, expect, it } from 'vitest'
import { type Edge, type Node, Position, getBezierPath } from '@xyflow/svelte'
import {
    EdgeLabelPositioner,
    type EdgeLabelSizeById
} from '../src/service/xyflow/edgelabelpositioner'
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

function estimateLabelSize(label: string): { width: number; height: number } {
    const rectangle = estimateLabelRect(0, 0, label)
    return {
        width: rectangle.width,
        height: rectangle.height
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

function expandRect(rectangle: Rect, margin: number): Rect {
    return {
        x: rectangle.x - margin,
        y: rectangle.y - margin,
        width: rectangle.width + margin * 2,
        height: rectangle.height + margin * 2
    }
}

function rectanglesRespectMinDistance(left: Rect, right: Rect, minDistance: number): boolean {
    return !rectanglesOverlap(left, expandRect(right, minDistance))
}

function rectFromSize(centerX: number, centerY: number, width: number, height: number): Rect {
    return {
        x: centerX - width / 2,
        y: centerY - height / 2,
        width,
        height
    }
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
    it('keeps default edge center when no measured label size exists', () => {
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

        expect((positioned.data as { labelX?: number }).labelX).toBeUndefined()
        expect((positioned.data as { labelY?: number }).labelY).toBeUndefined()

        const fallbackRect = estimateLabelRect(midpointX, midpointY, String(positioned.label ?? ''))
        expect(fallbackRect.width).toBeGreaterThan(0)
    })

    it('avoids node overlap when the midpoint collides with a node', () => {
        const nodes = [
            ...createSimpleLeftRightNodes(),
            createNode({ id: 'blocker', x: 170, y: 8, width: 70, height: 44 })
        ]
        const label = 'reads and writes data'
        const measuredSizes: EdgeLabelSizeById = {
            'edge-1': estimateLabelSize(label)
        }

        const [positioned] = EdgeLabelPositioner.positionLabels(
            nodes,
            [
                createEdge({
                    id: 'edge-1',
                    source: 'source',
                    target: 'target',
                    sourceHandle: 'source-0',
                    targetHandle: 'target-0',
                    label
                })
            ],
            measuredSizes
        )

        const labelX = (positioned.data as { labelX: number }).labelX
        const labelY = (positioned.data as { labelY: number }).labelY
        const labelRect = estimateLabelRect(labelX, labelY, String(positioned.label ?? ''))
        const blockerRect: Rect = { x: 170, y: 8, width: 70, height: 44 }

        expect(rectanglesRespectMinDistance(labelRect, blockerRect, 4)).toBe(true)
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
        const measuredSizes: EdgeLabelSizeById = {
            'edge-1': estimateLabelSize('first label'),
            'edge-2': estimateLabelSize('second label')
        }

        const [first, second] = EdgeLabelPositioner.positionLabels(nodes, edges, measuredSizes)

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

        expect(rectanglesRespectMinDistance(firstRect, secondRect, 4)).toBe(true)
    })

    it('separates several labels that would otherwise cluster around the same center', () => {
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
            }),
            createEdge({
                id: 'edge-3',
                source: 'source',
                target: 'target',
                sourceHandle: 'source-0',
                targetHandle: 'target-0',
                label: 'third label'
            })
        ]
        const measuredSizes: EdgeLabelSizeById = {
            'edge-1': estimateLabelSize('first label'),
            'edge-2': estimateLabelSize('second label'),
            'edge-3': estimateLabelSize('third label')
        }

        const positioned = EdgeLabelPositioner.positionLabels(nodes, edges, measuredSizes)
        const rectangles = positioned.map((edge) =>
            estimateLabelRect(
                (edge.data as { labelX: number }).labelX,
                (edge.data as { labelY: number }).labelY,
                String(edge.label ?? '')
            )
        )

        expect(rectanglesRespectMinDistance(rectangles[0], rectangles[1], 4)).toBe(true)
        expect(rectanglesRespectMinDistance(rectangles[0], rectangles[2], 4)).toBe(true)
        expect(rectanglesRespectMinDistance(rectangles[1], rectangles[2], 4)).toBe(true)
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

        const measuredSizes: EdgeLabelSizeById = {
            'edge-1': estimateLabelSize('observes')
        }

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
            ],
            measuredSizes
        )

        const labelRect = estimateLabelRect(
            (positioned.data as { labelX: number }).labelX,
            (positioned.data as { labelY: number }).labelY,
            String(positioned.label ?? '')
        )
        const nestedBlockerAbsoluteRect: Rect = { x: 170, y: 8, width: 80, height: 44 }

        expect(rectanglesRespectMinDistance(labelRect, nestedBlockerAbsoluteRect, 4)).toBe(true)
    })

    it('ignores group nodes as placement obstacles', () => {
        const nodes = [
            ...createSimpleLeftRightNodes(),
            createNode({ id: 'group', x: 150, y: 0, width: 140, height: 80, type: 'group' })
        ]
        const measuredSizes: EdgeLabelSizeById = {
            'edge-1': estimateLabelSize('inside group area')
        }

        const [positioned] = EdgeLabelPositioner.positionLabels(
            nodes,
            [
                createEdge({
                    id: 'edge-1',
                    source: 'source',
                    target: 'target',
                    sourceHandle: 'source-0',
                    targetHandle: 'target-0',
                    label: 'inside group area'
                })
            ],
            measuredSizes
        )

        const [_, midpointX, midpointY] = getBezierPath({
            sourceX: 100,
            sourceY: 30,
            sourcePosition: Position.Right,
            targetX: 300,
            targetY: 30,
            targetPosition: Position.Left
        })

        expect((positioned.data as { labelX?: number }).labelX).toBeCloseTo(midpointX)
        expect((positioned.data as { labelY?: number }).labelY).toBeCloseTo(midpointY)
    })

    it('uses measured label sizes when available', () => {
        const nodes = [
            ...createSimpleLeftRightNodes(),
            createNode({ id: 'blocker', x: 250, y: 20, width: 50, height: 20 })
        ]
        const edge = createEdge({
            id: 'edge-1',
            source: 'source',
            target: 'target',
            sourceHandle: 'source-0',
            targetHandle: 'target-0',
            label: 'x'
        })

        const measuredSizes: EdgeLabelSizeById = {
            'edge-1': {
                width: 220,
                height: 30
            }
        }

        const [positioned] = EdgeLabelPositioner.positionLabels(nodes, [edge], measuredSizes)
        const labelRect = rectFromSize(
            (positioned.data as { labelX: number }).labelX,
            (positioned.data as { labelY: number }).labelY,
            measuredSizes['edge-1']!.width,
            measuredSizes['edge-1']!.height
        )
        const blockerRect: Rect = { x: 250, y: 20, width: 50, height: 20 }

        expect(rectanglesRespectMinDistance(labelRect, blockerRect, 4)).toBe(true)
    })
})
