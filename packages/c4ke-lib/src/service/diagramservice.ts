import type { DiagramModel } from '../model/diagram/diagrammodel'
import { DiagramType } from '../model/diagram/diagramtype'
import { type Element } from '../model/diagram/element'
import { ElementType } from '../model/shared/elementtype'
import { type Relationship } from '../model/diagram/relationship'
import { Direction } from '../model/shared/direction'
import type {
    SzrElement,
    SzrModel,
    SzrRelationship,
    SzrView,
    SzrWorkspace
} from '../model/szr/szrworkspace'

export class DiagramService {
    static parse(workspace: SzrWorkspace): DiagramModel[] {
        const diagrams: DiagramModel[] = []

        workspace.views?.systemContextViews?.forEach((view) => {
            const diagramModel = {
                ...DiagramService.buildDiagramModel(workspace.model, view),
                type: DiagramType.SystemContextDiagram
            }
            diagrams.push(diagramModel)
        })

        workspace.views?.containerViews?.forEach((view) => {
            const diagramModel = {
                ...DiagramService.buildDiagramModel(workspace.model, view),
                type: DiagramType.ContainerDiagram
            }
            diagrams.push(diagramModel)
        })

        workspace.views?.componentViews?.forEach((view) => {
            const diagramModel = {
                ...DiagramService.buildDiagramModel(workspace.model, view),
                type: DiagramType.ComponentDiagram
            }
            diagrams.push(diagramModel)
        })

        return diagrams
    }

    /**
     *
     * @param model The model
     * @param view The view
     */
    private static buildDiagramModel(model: SzrModel, view: SzrView): DiagramModel {
        let elements: Element[] = []

        for (const person of model.people ?? []) {
            if (view.elements?.find((e) => e.id === person.id)) {
                elements.push(DiagramService.createElement(person, ElementType.Person))
            }
        }

        for (const softwareSystem of model.softwareSystems ?? []) {
            const softwareSystemElement = DiagramService.createElement(
                softwareSystem,
                ElementType.SoftwareSystem
            )

            for (const container of softwareSystem.containers ?? []) {
                const containerElement = DiagramService.createElement(
                    container,
                    ElementType.Container
                )

                for (const component of container.components ?? []) {
                    const componentElement = DiagramService.createElement(
                        component,
                        ElementType.Component
                    )
                    if (view.elements?.find((e) => e.id === component.id)) {
                        containerElement.children.push(componentElement)
                    }
                }

                if (
                    view.elements?.find((e) => e.id === container.id) ||
                    containerElement.children.length > 0
                ) {
                    softwareSystemElement.children.push(containerElement)
                }
            }

            if (
                view.elements?.find((e) => e.id === softwareSystem.id) ||
                softwareSystemElement.children.length > 0
            ) {
                elements.push(softwareSystemElement)
            }
        }

        let relationships: Relationship[] = []

        for (const person of model.people ?? []) {
            for (const relationship of person.relationships ?? []) {
                if (view.relationships?.find((r) => r.id === relationship.id)) {
                    relationships.push(DiagramService.createRelationship(relationship))
                }
            }
        }

        for (const softwareSystem of model.softwareSystems ?? []) {
            for (const relationship of softwareSystem.relationships ?? []) {
                if (view.relationships?.find((r) => r.id === relationship.id)) {
                    relationships.push(DiagramService.createRelationship(relationship))
                }
            }

            for (const container of softwareSystem.containers ?? []) {
                for (const relationship of container.relationships ?? []) {
                    if (view.relationships?.find((r) => r.id === relationship.id)) {
                        relationships.push(DiagramService.createRelationship(relationship))
                    }
                }

                for (const component of container.components ?? []) {
                    for (const relationship of component.relationships ?? []) {
                        if (view.relationships?.find((r) => r.id === relationship.id)) {
                            relationships.push(DiagramService.createRelationship(relationship))
                        }
                    }
                }
            }
        }

        // Diagram title
        const colonIndex = view.name.indexOf(':')
        const diagramTitle =
            colonIndex !== -1 ? view.name.substring(colonIndex + 2).trim() : view.name

        return {
            id: view.key,
            title: diagramTitle,
            direction: DiagramService.getDirection(view),
            elements: elements,
            relationships: relationships
        }
    }

    private static createElement(szrElement: SzrElement, type: ElementType): Element {
        return {
            id: szrElement.id,
            metaData: {
                title: szrElement.name,
                description: szrElement.description,
                technology: szrElement.technology,
                tags: szrElement.tags,
                type: type
            },
            children: []
        }
    }

    private static createRelationship(szrRelationship: SzrRelationship): Relationship {
        return {
            id: szrRelationship.id,
            sourceId: szrRelationship.sourceId,
            targetId: szrRelationship.destinationId,
            description: szrRelationship.description
        }
    }

    private static getDirection(view: SzrView): Direction {
        const rankDirection = view.automaticLayout?.rankDirection
        switch (rankDirection) {
            case 'LeftRight':
                return Direction.LeftRight
            case 'RightLeft':
                return Direction.RightLeft
            case 'TopBottom':
                return Direction.TopBottom
            case 'BottomTop':
                return Direction.BottomTop
            default:
                return Direction.LeftRight
        }
    }
}
