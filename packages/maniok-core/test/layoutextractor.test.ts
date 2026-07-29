import { describe, expect, it } from 'vitest'
import type { Node } from '@xyflow/svelte'
import { LayoutExtractor } from '../src/service/xyflow/layoutextractor'
import { DirectionEnum } from '../src/model/shared/direction'

function createNode(node: Partial<Node> & Pick<Node, 'id'>): Node {
    return {
        id: node.id,
        position: node.position ?? { x: 0, y: 0 },
        data: node.data ?? {},
        width: node.width,
        height: node.height,
        measured: node.measured,
        type: node.type,
        parentId: node.parentId
    }
}

describe('LayoutExtractor', () => {
    it('uses node width and height when measured dimensions are not available', () => {
        const nodes: Node[] = [
            createNode({
                id: 'node-1',
                width: 220,
                height: 140
            })
        ]

        const layout = LayoutExtractor.toLayoutModel(nodes, [], DirectionEnum.LeftRight)
        const extracted = layout.layoutElements[0]

        expect(extracted.width).toBe(220)
        expect(extracted.height).toBe(140)
    })

    it('prefers measured dimensions when they are available', () => {
        const nodes: Node[] = [
            createNode({
                id: 'node-1',
                width: 220,
                height: 140,
                measured: { width: 180, height: 120 }
            })
        ]

        const layout = LayoutExtractor.toLayoutModel(nodes, [], DirectionEnum.LeftRight)
        const extracted = layout.layoutElements[0]

        expect(extracted.width).toBe(180)
        expect(extracted.height).toBe(120)
    })
})
