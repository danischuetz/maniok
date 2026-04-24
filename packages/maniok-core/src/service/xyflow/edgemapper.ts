import { type Node, type Edge, Position, MarkerType } from '@xyflow/svelte'
import { type RelationshipModel } from '../../model/diagram/relationship'
import type { ConnectionModel } from '../../model/diagram/connection'

export class EdgeMapper {
    static toEdges(nodes: Node[], relationships: RelationshipModel[]): Edge[] {
        const connections: Map<Node, ConnectionModel[]> = new Map()

        const edges: Edge[] = relationships.map((relationship) => {
            const sourceNode: Node = nodes.find((node) => node.id === relationship.sourceId)!
            const targetNode: Node = nodes.find((node) => node.id === relationship.targetId)!

            if (!connections.has(sourceNode)) connections.set(sourceNode, [])
            if (!connections.has(targetNode)) connections.set(targetNode, [])

            const sourceIndex: number = connections.get(sourceNode)!.length
            const targetIndex: number = connections.get(targetNode)!.length
            const sourceId: string = `${sourceNode.id}-${sourceIndex}`
            const targetId: string = `${targetNode.id}-${targetIndex}`

            connections.get(sourceNode)!.push({
                id: sourceId,
                position: Position.Right,
                type: 'source'
            })

            connections.get(targetNode)!.push({
                id: targetId,
                position: Position.Left,
                type: 'target'
            })

            return {
                id: relationship.id,
                source: sourceNode.id,
                target: targetNode.id,
                sourceHandle: sourceId,
                targetHandle: targetId,
                label: relationship.description ?? '',
                type: 'custom'
            }
        })

        connections.forEach((conns, node) => {
            node.data.connections = conns
        })

        return edges
    }
}
