import { describe, it, expect, beforeAll } from 'vitest'
import { testWorkspace } from './data/testworkspace'
import { type DiagramModel } from '../src/model/diagram/diagrammodel'
import { DiagramParser } from '../src/service/diagramparser'
import { DiagramType } from '../src/model/diagram/diagramtype'

const diagrams: DiagramModel[] = DiagramParser.parse(testWorkspace)

describe('SystemContextViews', () => {
    let systemContextDiagram: DiagramModel = diagrams.find(
        (d) => d.type === DiagramType.SystemContextDiagram
    )!

    it('should have no groups', () => {
        for (const element of systemContextDiagram.elements) {
            expect(element.children.length).toBe(0)
        }
    })
})

describe('ContainerViews', () => {
    let containerDiagram: DiagramModel = diagrams.find(
        (d) => d.type === DiagramType.ContainerDiagram
    )!

    it('should have a software system group with the expected id', () => {
        const softwareSystemId: string = testWorkspace.views!.containerViews!.find(
            (view) => view.key === containerDiagram.id
        )!.softwareSystemId

        expect(containerDiagram.elements.find((e) => e.id === softwareSystemId)).toBeDefined()
        expect(
            containerDiagram.elements.find((e) => e.id === softwareSystemId)!.children.length
        ).toBeGreaterThan(0)
    })
})

describe('ComponentViews', () => {
    let componentDiagram: DiagramModel = diagrams.find(
        (d) => d.type === DiagramType.ComponentDiagram
    )!

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
})
