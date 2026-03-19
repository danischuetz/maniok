import type { DiagramModel } from '../model/diagram/diagrammodel'
import { type Element } from '../model/diagram/element'
import { ElementType } from '../model/diagram/elementtype'
import { type Relationship } from '../model/diagram/relationship'
import { Direction } from '../model/diagram/direction'
import type {
    SzrElement,
    SzrModel,
    SzrRelationship,
    SzrView,
    SzrWorkspace
} from '../model/szr/szrworkspace'

export enum DiagramType {
    SystemContextDiagram = 'SystemContextDiagram',
    ContainerDiagram = 'ContainerDiagram',
    ComponentDiagram = 'ComponentDiagram'
}
export class DiagramParser {
    static parse(workspace: SzrWorkspace): DiagramModel[] {
        const diagrams: DiagramModel[] = []

        workspace.views?.systemContextViews?.forEach((view) => {
            const diagramModel = DiagramParser.buildDiagramModel(workspace.model, view)
            diagrams.push(diagramModel)
        })

        workspace.views?.containerViews?.forEach((view) => {
            const diagramModel = DiagramParser.buildDiagramModel(workspace.model, view)
            diagrams.push(diagramModel)
        })

        workspace.views?.componentViews?.forEach((view) => {
            const diagramModel = DiagramParser.buildDiagramModel(workspace.model, view)
            diagrams.push(diagramModel)
        })

        return diagrams
    }

    /**
     *
     * @param view A view
     * @param type the view type
     * @param coreElementId E.g. the softwareSystemId in a container view or the containerId in a componentView
     */
    private static buildDiagramModel(model: SzrModel, view: SzrView): DiagramModel {
        let elements: Element[] = []

        for (const person of model.people ?? []) {
            if (view.elements?.find((e) => e.id === person.id)) {
                elements.push(DiagramParser.createElement(person, ElementType.Person))
            }
        }

        for (const softwareSystem of model.softwareSystems ?? []) {
            const softwareSystemElement = DiagramParser.createElement(
                softwareSystem,
                ElementType.SoftwareSystem
            )

            for (const container of softwareSystem.containers ?? []) {
                const containerElement = DiagramParser.createElement(
                    container,
                    ElementType.Container
                )

                for (const component of container.components ?? []) {
                    const componentElement = DiagramParser.createElement(
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
        for (const softwareSystem of model.softwareSystems ?? []) {
            for (const relationship of softwareSystem.relationships ?? []) {
                if (view.relationships?.find((r) => r.id === relationship.id)) {
                    relationships.push(DiagramParser.createRelationship(relationship))
                }
            }

            for (const container of softwareSystem.containers ?? []) {
                for (const relationship of container.relationships ?? []) {
                    if (view.relationships?.find((r) => r.id === relationship.id)) {
                        relationships.push(DiagramParser.createRelationship(relationship))
                    }
                }

                for (const component of container.components ?? []) {
                    for (const relationship of component.relationships ?? []) {
                        if (view.relationships?.find((r) => r.id === relationship.id)) {
                            relationships.push(DiagramParser.createRelationship(relationship))
                        }
                    }
                }
            }
        }

        return {
            id: view.key,
            title: view.name,
            direction: DiagramParser.getDirection(view),
            elements: elements,
            relationships: relationships
        }
    }

    private static createElement(szrElement: SzrElement, type: ElementType): Element {
        return {
            id: szrElement.id,
            x: 0,
            y: 0,
            width: 100,
            height: 50,
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
