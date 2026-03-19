import { describe, it, expect, beforeAll } from 'vitest'
import { Direction } from '../src/model/diagram/direction'
import { DiagramModel } from '../src/model/diagram/diagrammodel'
import { LayoutEngine } from '../src/service/layoutengine'
import { Element } from '../src/model/diagram/element'
import { create } from 'node:domain'
import { beforeEach } from 'node:test'

function createElement(id: string): Element {
    return {
        id,
        x: 0,
        y: 0,
        width: 100 + 10 * parseInt(id),
        height: 50 + 5 * parseInt(id),
        metaData: {},
        children: []
    }
}

function createRelationship(sourceId: string, targetId: string) {
    return {
        id: `${sourceId}-${targetId}`,
        sourceId,
        targetId
    }
}

function createFlatDiagram(direction: Direction): DiagramModel {
    return {
        id: 'test-diagram',
        direction: direction,
        elements: [createElement('1'), createElement('2'), createElement('3')],
        relationships: [createRelationship('1', '2'), createRelationship('1', '3')]
    }
}

function createNestedDiagram(direction: Direction): DiagramModel {
    return {
        id: 'test-diagram',
        direction: direction,
        elements: [
            createElement('1'),
            {
                ...createElement('2'),
                children: [createElement('2.1'), createElement('2.2')]
            },
            createElement('3')
        ],
        relationships: [createRelationship('1', '2.1'), createRelationship('2.1', '3')]
    }
}

for (const direction of Object.values(Direction)) {
    describe('FlatDiagrams', () => {
        let diagram: DiagramModel

        beforeAll(() => {
            const layoutEngine = new LayoutEngine()
            diagram = createFlatDiagram(direction)
            layoutEngine.layout(diagram)
        })

        it('should layout elements without overlap', () => {
            const element1 = diagram.elements.find((e) => e.id === '1')!
            const element2 = diagram.elements.find((e) => e.id === '2')!

            switch (direction) {
                case Direction.TopBottom:
                    expect(element2.y).toBeGreaterThan(element1.y + element1.height)
                    break
                case Direction.LeftRight:
                    expect(element2.x).toBeGreaterThan(element1.x + element1.width)
                    break
                case Direction.BottomTop:
                    expect(element2.y).toBeLessThan(element1.y - element2.height)
                    break
                case Direction.RightLeft:
                    expect(element2.x).toBeLessThan(element1.x - element2.width)
                    break
            }
        })

        // it('should align elements at the same level', () => {
        //     const element2 = diagram.elements.find((e) => e.id === '2')!
        //     const element3 = diagram.elements.find((e) => e.id === '3')!

        //     switch (direction) {
        //         case Direction.TopBottom:
        //             expect(element2.y).toEqual(element3.y)
        //             break
        //         case Direction.BottomTop:
        //             expect(element2.y - element2.height).toEqual(element3.y - element3.height)
        //             break
        //         case Direction.LeftRight:
        //             expect(element2.x).toEqual(element3.x)
        //             break
        //         case Direction.RightLeft:
        //             expect(element2.x + element2.width).toEqual(element3.x + element3.width)
        //             break
        //     }
        // })
    })
}

describe('NestedDiagrams', () => {
    let diagram: DiagramModel

    beforeAll(() => {
        const layoutEngine = new LayoutEngine()
        diagram = createNestedDiagram(Direction.LeftRight)
        layoutEngine.layout(diagram)
    })

    it('should layout nested elements inside their parent', () => {
        const parent = diagram.elements.find((e) => e.id === '2')!
        const child1 = parent.children.find((e) => e.id === '2.1')!
        const child2 = parent.children.find((e) => e.id === '2.2')!

        expect(child1.x).toBeGreaterThanOrEqual(parent.x)
        expect(child1.y).toBeGreaterThanOrEqual(parent.y)
        expect(child1.x + child1.width).toBeLessThanOrEqual(parent.x + parent.width)
        expect(child1.y + child1.height).toBeLessThanOrEqual(parent.y + parent.height)

        expect(child2.x).toBeGreaterThanOrEqual(parent.x)
        expect(child2.y).toBeGreaterThanOrEqual(parent.y)
        expect(child2.x + child2.width).toBeLessThanOrEqual(parent.x + parent.width)
        expect(child2.y + child2.height).toBeLessThanOrEqual(parent.y + parent.height)
    })
})
