import { describe, it, expect } from 'vitest'
import { testWorkspace } from './data/testworkspace'
import { type DiagramModel } from '../src/model/diagram/diagrammodel'
import { DiagramParser } from '../src/service/diagramparser'
import { DiagramUtils } from '../src/util/diagramutils'

const diagrams: DiagramModel[] = DiagramParser.parse(testWorkspace)

const systemContextDiagramId: string = testWorkspace.views!.systemContextViews![0].key
const containerDiagramId: string = testWorkspace.views!.containerViews![0].key
const componentDiagramId: string = testWorkspace.views!.componentViews![0].key

describe('SystemContextViews', () => {
    let systemContextDiagram: DiagramModel = diagrams.find((d) => d.id === systemContextDiagramId)!

    it('should have no groups', () => {
        for (const element of systemContextDiagram.elements) {
            expect(element.children.length).toBe(0)
        }
    })

    it('should have the same amount of elements as the view', () => {
        const view = testWorkspace.views!.systemContextViews!.find(
            (view) => view.key === systemContextDiagram.id
        )!

        const flatElements = DiagramUtils.flattenElementList(systemContextDiagram.elements)
        expect(flatElements.length).toBe(view.elements?.length ?? 0)
    })
})

describe('ContainerViews', () => {
    let containerDiagram: DiagramModel = diagrams.find((d) => d.id === containerDiagramId)!

    it('should have a software system group with the expected id', () => {
        const softwareSystemId: string = testWorkspace.views!.containerViews!.find(
            (view) => view.key === containerDiagram.id
        )!.softwareSystemId

        expect(containerDiagram.elements.find((e) => e.id === softwareSystemId)).toBeDefined()
        expect(
            containerDiagram.elements.find((e) => e.id === softwareSystemId)!.children.length
        ).toBeGreaterThan(0)
    })

    it('should have the same amount of elements as the view plus the system group', () => {
        const view = testWorkspace.views!.containerViews!.find(
            (view) => view.key === containerDiagram.id
        )!

        const flatElements = DiagramUtils.flattenElementList(containerDiagram.elements)
        expect(flatElements.length).toBe((view.elements?.length ?? 0) + 1)
    })
})

describe('ComponentViews', () => {
    let componentDiagram: DiagramModel = diagrams.find((d) => d.id === componentDiagramId)!

    it('should have a container group with the expected id', () => {
        const containerId: string = testWorkspace.views!.componentViews!.find(
            (view) => view.key === componentDiagram.id
        )!.containerId

        const softwareSystemId: string = testWorkspace.model.softwareSystems!.find((system) =>
            system.containers?.find((c) => c.id === containerId)
        )!.id

        const softwareSystemElement = componentDiagram.elements.find(
            (e) => e.id === softwareSystemId
        )
        expect(softwareSystemElement).toBeDefined()
        expect(softwareSystemElement!.children.length).toBeGreaterThan(0)
        expect(softwareSystemElement!.children.find((e) => e.id === containerId)).toBeDefined()
        expect(
            softwareSystemElement!.children.find((e) => e.id === containerId)!.children.length
        ).toBeGreaterThan(0)
    })

    it('should have the same amount of elements as the view plus the system group and container group', () => {
        const view = testWorkspace.views!.componentViews!.find(
            (view) => view.key === componentDiagram.id
        )!

        const flatElements = DiagramUtils.flattenElementList(componentDiagram.elements)
        expect(flatElements.length).toBe((view.elements?.length ?? 0) + 2)
    })
})

describe('diagrams', () => {
    for (const diagram of diagrams) {
        if (diagram.id !== 'Container-001') continue
        it.only('should have relationships matching elements', () => {
            for (const relationship of diagram.relationships) {
                const sourceElement = DiagramUtils.findElementById(diagram, relationship.sourceId)
                const targetElement = DiagramUtils.findElementById(diagram, relationship.targetId)

                expect(
                    sourceElement,
                    `Source element "${relationship.sourceId}" not found in diagram "${diagram.id}" for relationship "${relationship.id}"`
                ).toBeDefined()
                expect(
                    targetElement,
                    `Target element "${relationship.targetId}" not found in diagram "${diagram.id}" for relationship "${relationship.id}"`
                ).toBeDefined()
            }
        })
    }
})
