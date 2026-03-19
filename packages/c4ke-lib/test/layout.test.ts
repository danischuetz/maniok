import { describe, it, expect, beforeAll } from 'vitest'
import { Direction } from '../src/model/shared/direction'
import { DiagramModel } from '../src/model/diagram/diagrammodel'
import { LayoutEngine } from '../src/service/layoutengine'

import { createFlatLayout, createNestedLayout } from './utils/testLayouts'
import { LayoutModel } from '../src/model/layout/layoutmodel'

for (const direction of Object.values(Direction)) {
    describe('FlatDiagrams', () => {
        let layoutModel: LayoutModel

        beforeAll(() => {
            layoutModel = createFlatLayout(direction)
            const layoutEngine = new LayoutEngine()
            layoutEngine.layout(layoutModel)
        })

        it('should layout elements without overlap', () => {
            const element1 = layoutModel.layoutElements.find((e) => e.id === '1')!
            const element2 = layoutModel.layoutElements.find((e) => e.id === '2')!

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
    })
}

describe('NestedDiagrams', () => {
    let layoutModel: LayoutModel

    beforeAll(() => {
        const layoutEngine = new LayoutEngine()
        layoutModel = createNestedLayout(Direction.LeftRight)
        layoutEngine.layout(layoutModel)
    })

    it('should layout nested elements inside their parent', () => {
        const parent = layoutModel.layoutElements.find((e) => e.id === '2')!
        const child1 = layoutModel.layoutElements.find((e) => e.id === '2.1')!
        const child2 = layoutModel.layoutElements.find((e) => e.id === '2.2')!

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
