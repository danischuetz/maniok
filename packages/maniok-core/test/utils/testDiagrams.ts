import { DirectionEnum } from '../../src/model/shared/direction'
import type { DiagramModel } from '../../src/model/diagram/diagrammodel'
import type { ElementModel } from '../../src/model/diagram/element'

export function createElement(id: string): ElementModel {
    return {
        id,
        metaData: {
            connections: []
        },
        children: []
    }
}

export function createRelationship(sourceId: string, targetId: string) {
    return {
        id: `${sourceId}-${targetId}`,
        sourceId,
        targetId
    }
}

export function createNestedDiagram(direction: DirectionEnum): DiagramModel {
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

export function createMultiConnectionDiagram(direction: DirectionEnum): DiagramModel {
    return {
        id: 'test-diagram',
        direction: direction,
        elements: [createElement('1'), createElement('2'), createElement('3')],
        relationships: [
            createRelationship('1', '2'),
            createRelationship('1', '3'),
            createRelationship('2', '3')
        ]
    }
}
