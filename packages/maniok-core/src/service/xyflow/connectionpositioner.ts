import { type Node, type Edge, Position } from '@xyflow/svelte'
import type { ConnectionModel } from '../../model/diagram/connection'
import { DirectionEnum } from '../../model/shared/direction'
import { ConnectionSorter } from './connectionsorter'
import { NodePositionResolver } from './nodepositionresolver'

export class ConnectionPositioner {
    static setSourceAndTargetPositions(
        nodes: Node[],
        edges: Edge[],
        direction: DirectionEnum
    ): Node[] {
        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)
            const targetNode = nodes.find((node) => node.id === edge.target)

            if (!sourceNode || !targetNode)
                throw new Error(`Source or target node not found for edge ${edge.id}`)

            const edgeDirection: DirectionEnum = this.getEdgeDirection(
                sourceNode,
                targetNode,
                nodes,
                direction
            )

            const sourceConnections = sourceNode.data.connections as ConnectionModel[]
            const sourceConnection = sourceConnections.find((conn) => conn.id === edge.sourceHandle)

            const targetConnections = targetNode.data.connections as ConnectionModel[]
            const targetConnection = targetConnections.find((conn) => conn.id === edge.targetHandle)

            if (!sourceConnection || !targetConnection)
                throw new Error(`Source or target connection not found for edge ${edge.id}`)

            switch (edgeDirection) {
                case DirectionEnum.LeftRight:
                    sourceConnection.position = Position.Right
                    targetConnection.position = Position.Left
                    break
                case DirectionEnum.RightLeft:
                    sourceConnection.position = Position.Left
                    targetConnection.position = Position.Right
                    break
                case DirectionEnum.TopBottom:
                    sourceConnection.position = Position.Bottom
                    targetConnection.position = Position.Top
                    break
                case DirectionEnum.BottomTop:
                    sourceConnection.position = Position.Top
                    targetConnection.position = Position.Bottom
                    break
            }
        })

        ConnectionSorter.sortConnectionsPerPosition(nodes, edges)

        return nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                connections: ((node.data.connections as ConnectionModel[] | undefined) ?? []).map(
                    (connection) => ({ ...connection })
                )
            }
        }))
    }

    static getEdgeDirection(
        sourceNode: Node,
        targetNode: Node,
        nodes: Node[],
        diagramDirection: DirectionEnum
    ): DirectionEnum {
        const sourcePosition = NodePositionResolver.getAbsoluteNodePosition(sourceNode, nodes)
        const targetPosition = NodePositionResolver.getAbsoluteNodePosition(targetNode, nodes)

        switch (diagramDirection) {
            case DirectionEnum.LeftRight:
                return sourcePosition.x < targetPosition.x
                    ? DirectionEnum.LeftRight
                    : DirectionEnum.RightLeft
            case DirectionEnum.RightLeft:
                return sourcePosition.x > targetPosition.x
                    ? DirectionEnum.RightLeft
                    : DirectionEnum.LeftRight
            case DirectionEnum.TopBottom:
                return sourcePosition.y < targetPosition.y
                    ? DirectionEnum.TopBottom
                    : DirectionEnum.BottomTop
            case DirectionEnum.BottomTop:
                return sourcePosition.y > targetPosition.y
                    ? DirectionEnum.BottomTop
                    : DirectionEnum.TopBottom
        }
    }
}
