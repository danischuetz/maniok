import type { DiagramModel } from '../model/diagram/diagrammodel'
import { DiagramTypeModel } from '../model/diagram/diagramtype'
import { type ElementModel } from '../model/diagram/element'
import { ElementTypeEnum } from '../model/shared/elementtype'
import { type RelationshipModel } from '../model/diagram/relationship'
import { DirectionEnum } from '../model/shared/direction'
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
                type: DiagramTypeModel.SystemContextDiagram
            }
            diagrams.push(diagramModel)
        })

        workspace.views?.containerViews?.forEach((view) => {
            const diagramModel = {
                ...DiagramService.buildDiagramModel(workspace.model, view),
                type: DiagramTypeModel.ContainerDiagram
            }
            diagrams.push(diagramModel)
        })

        workspace.views?.componentViews?.forEach((view) => {
            const diagramModel = {
                ...DiagramService.buildDiagramModel(workspace.model, view),
                type: DiagramTypeModel.ComponentDiagram
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
        let elements: ElementModel[] = []

        for (const person of model.people ?? []) {
            if (view.elements?.find((e) => e.id === person.id)) {
                elements.push(DiagramService.createElement(person, ElementTypeEnum.Person))
            }
        }

        for (const softwareSystem of model.softwareSystems ?? []) {
            const softwareSystemElement = DiagramService.createElement(
                softwareSystem,
                ElementTypeEnum.SoftwareSystem
            )

            for (const container of softwareSystem.containers ?? []) {
                const containerElement = DiagramService.createElement(
                    container,
                    ElementTypeEnum.Container
                )

                for (const component of container.components ?? []) {
                    const componentElement = DiagramService.createElement(
                        component,
                        ElementTypeEnum.Component
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

        let relationships: RelationshipModel[] = []

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

        return {
            id: view.key,
            title: DiagramService.deriveDiagramTitle(view),
            direction: DiagramService.getDirection(view),
            elements: elements,
            relationships: relationships
        }
    }

    private static createElement(szrElement: SzrElement, type: ElementTypeEnum): ElementModel {
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

    private static createRelationship(szrRelationship: SzrRelationship): RelationshipModel {
        return {
            id: szrRelationship.id,
            sourceId: szrRelationship.sourceId,
            targetId: szrRelationship.destinationId,
            description: szrRelationship.description
        }
    }

    private static getDirection(view: SzrView): DirectionEnum {
        const rankDirection = view.automaticLayout?.rankDirection
        switch (rankDirection) {
            case 'LeftRight':
                return DirectionEnum.LeftRight
            case 'RightLeft':
                return DirectionEnum.RightLeft
            case 'TopBottom':
                return DirectionEnum.TopBottom
            case 'BottomTop':
                return DirectionEnum.BottomTop
            default:
                return DirectionEnum.LeftRight
        }
    }

    private static deriveDiagramTitle(view: SzrView): string {
        if (view.title) return view.title

        const type: ElementTypeEnum = DiagramService.getElementType(view)

        const colonIndex = view.name.lastIndexOf(':')
        const name: string =
            colonIndex !== -1 ? view.name.substring(colonIndex + 2).trim() : view.name

        return type + ': ' + name
    }

    private static getElementType(view: SzrView): ElementTypeEnum {
        if ('softwareSystemId' in view) {
            return ElementTypeEnum.SoftwareSystem
        } else if ('containerId' in view) {
            return ElementTypeEnum.Container
        } else {
            return ElementTypeEnum.Component
        }
    }
}
