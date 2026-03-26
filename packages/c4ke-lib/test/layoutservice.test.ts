import { describe, it, expect, beforeAll } from 'vitest'
import { DirectionEnum } from '../src/model/shared/direction'
import { LayoutService } from '../src/service/layoutservice'

import { createFlatLayout, createNestedLayout, createNestedNestedLayout } from './utils/testLayouts'
import type { LayoutModel } from '../src/model/layout/layout'

for (const direction of Object.values(DirectionEnum)) {
    describe('FlatDiagrams', () => {
        let layoutModel: LayoutModel

        beforeAll(() => {
            layoutModel = createFlatLayout(direction)
            const layoutEngine = new LayoutService()
            layoutEngine.layout(layoutModel)
        })

        it('should layout elements without overlap', () => {
            const element1 = layoutModel.layoutElements.find((e) => e.id === '1')!
            const element2 = layoutModel.layoutElements.find((e) => e.id === '2')!

            switch (direction) {
                case DirectionEnum.TopBottom:
                    expect(element2.y).toBeGreaterThan(element1.y + element1.height)
                    break
                case DirectionEnum.LeftRight:
                    expect(element2.x).toBeGreaterThan(element1.x + element1.width)
                    break
                case DirectionEnum.BottomTop:
                    expect(element2.y).toBeLessThan(element1.y - element2.height)
                    break
                case DirectionEnum.RightLeft:
                    expect(element2.x).toBeLessThan(element1.x - element2.width)
                    break
            }
        })
    })
}

/** Important: Nested elements are positioned relative to their parent */
describe('NestedDiagrams', () => {
    let layoutModel: LayoutModel

    beforeAll(() => {
        const layoutEngine = new LayoutService()
        layoutModel = createNestedLayout(DirectionEnum.LeftRight)
        layoutEngine.layout(layoutModel)
    })

    it('should layout nested elements inside their parent', () => {
        const parent = layoutModel.layoutElements.find((e) => e.id === '2')!
        const child1 = layoutModel.layoutElements.find((e) => e.id === '2.1')!
        const child2 = layoutModel.layoutElements.find((e) => e.id === '2.2')!

        expect(child1.x).toBeGreaterThanOrEqual(0)
        expect(child1.y).toBeGreaterThanOrEqual(0)
        expect(child1.x + child1.width).toBeLessThanOrEqual(parent.width)
        expect(child1.y + child1.height).toBeLessThanOrEqual(parent.height)

        expect(child2.x).toBeGreaterThanOrEqual(0)
        expect(child2.y).toBeGreaterThanOrEqual(0)
        expect(child2.x + child2.width).toBeLessThanOrEqual(parent.width)
        expect(child2.y + child2.height).toBeLessThanOrEqual(parent.height)
    })
})

describe('NestedNestedDiagrams', () => {
    let layoutModel: LayoutModel

    beforeAll(() => {
        const layoutEngine = new LayoutService()
        layoutModel = createNestedNestedLayout(DirectionEnum.LeftRight)
        layoutEngine.layout(layoutModel)
    })

    it('should layout nested elements inside their parent', () => {
        const parent = layoutModel.layoutElements.find((e) => e.id === '2')!
        const child1 = layoutModel.layoutElements.find((e) => e.id === '2.1')!
        const child2 = layoutModel.layoutElements.find((e) => e.id === '2.2')!
        const nestedChild1 = layoutModel.layoutElements.find((e) => e.id === '2.2.1')!
        const nestedChild2 = layoutModel.layoutElements.find((e) => e.id === '2.2.2')!

        expect(child1.x).toBeGreaterThanOrEqual(0)
        expect(child1.y).toBeGreaterThanOrEqual(0)
        expect(child1.x + child1.width).toBeLessThanOrEqual(parent.width)
        expect(child1.y + child1.height).toBeLessThanOrEqual(parent.height)

        expect(child2.x).toBeGreaterThanOrEqual(0)
        expect(child2.y).toBeGreaterThanOrEqual(0)
        expect(child2.x + child2.width).toBeLessThanOrEqual(parent.width)
        expect(child2.y + child2.height).toBeLessThanOrEqual(parent.height)

        expect(nestedChild1.x).toBeGreaterThanOrEqual(0)
        expect(nestedChild1.y).toBeGreaterThanOrEqual(0)
        expect(nestedChild1.x + nestedChild1.width).toBeLessThanOrEqual(child2.width)
        expect(nestedChild1.y + nestedChild1.height).toBeLessThanOrEqual(child2.height)

        expect(nestedChild2.x).toBeGreaterThanOrEqual(0)
        expect(nestedChild2.y).toBeGreaterThanOrEqual(0)
        expect(nestedChild2.x + nestedChild2.width).toBeLessThanOrEqual(child2.width)
        expect(nestedChild2.y + nestedChild2.height).toBeLessThanOrEqual(child2.height)
    })
})
