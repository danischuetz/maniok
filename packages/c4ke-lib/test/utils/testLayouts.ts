import { Direction } from '../../src/model/shared/direction'
import { type LayoutModel } from '../../src/model/layout/layoutmodel'
import { type LayoutElement } from '../../src/model/layout/layoutelement'
import { LayoutEdge } from '../../src/model/layout/layoutedge'

export function createElement(id: string, parentId: string | null = null): LayoutElement {
    return {
        id,
        parentId,
        x: 0,
        y: 0,
        width: 100,
        height: 50
    }
}

export function createEdge(sourceId: string, targetId: string): LayoutEdge {
    return {
        sourceId,
        targetId
    }
}

export function createFlatLayout(direction: Direction): LayoutModel {
    return {
        direction: direction,
        layoutElements: [createElement('1'), createElement('2'), createElement('3')],
        layoutEdges: [createEdge('1', '2'), createEdge('1', '3')]
    }
}

export function createNestedLayout(direction: Direction): LayoutModel {
    return {
        direction: direction,
        layoutElements: [
            createElement('1'),
            createElement('2'),
            createElement('2.1', '2'),
            createElement('2.2', '2'),
            createElement('3')
        ],
        layoutEdges: [createEdge('1', '2.1'), createEdge('2.1', '3')]
    }
}
