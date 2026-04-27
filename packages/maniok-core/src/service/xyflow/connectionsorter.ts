import { type Node, type Edge, Position } from '@xyflow/svelte'
import type { ConnectionModel } from '../../model/diagram/connection'
import { NodePositionResolver } from './nodepositionresolver'

export class ConnectionSorter {
    static sortConnectionsPerPosition(nodes: Node[], edges: Edge[]): void {
        const edgesBySourceHandle = new Map<string, Edge>()
        const edgesByTargetHandle = new Map<string, Edge>()

        edges.forEach((edge) => {
            if (edge.sourceHandle) edgesBySourceHandle.set(edge.sourceHandle, edge)
            if (edge.targetHandle) edgesByTargetHandle.set(edge.targetHandle, edge)
        })

        nodes.forEach((node) => {
            const connections = (
                (node.data.connections as ConnectionModel[] | undefined) ?? []
            ).slice()

            connections.sort((a, b) => {
                const aSort = this.getConnectionSortData(
                    a,
                    nodes,
                    edgesBySourceHandle,
                    edgesByTargetHandle
                )
                const bSort = this.getConnectionSortData(
                    b,
                    nodes,
                    edgesBySourceHandle,
                    edgesByTargetHandle
                )

                if (aSort.primary !== bSort.primary) return aSort.primary - bSort.primary
                if (aSort.secondary !== bSort.secondary) return aSort.secondary - bSort.secondary
                return a.id.localeCompare(b.id)
            })

            node.data.connections = connections
        })
    }

    static getConnectionSortData(
        connection: ConnectionModel,
        nodes: Node[],
        edgesBySourceHandle: Map<string, Edge>,
        edgesByTargetHandle: Map<string, Edge>
    ): { primary: number; secondary: number } {
        const edge =
            connection.type === 'source'
                ? edgesBySourceHandle.get(connection.id)
                : edgesByTargetHandle.get(connection.id)

        if (!edge) return { primary: Number.POSITIVE_INFINITY, secondary: Number.POSITIVE_INFINITY }

        const oppositeNodeId = connection.type === 'source' ? edge.target : edge.source
        const oppositeNode = nodes.find((node) => node.id === oppositeNodeId)

        if (!oppositeNode)
            return { primary: Number.POSITIVE_INFINITY, secondary: Number.POSITIVE_INFINITY }

        const oppositePosition = NodePositionResolver.getAbsoluteNodePosition(oppositeNode, nodes)

        switch (connection.position as Position) {
            case Position.Left:
            case Position.Right:
                return { primary: oppositePosition.y, secondary: oppositePosition.x }
            case Position.Top:
            case Position.Bottom:
                return { primary: oppositePosition.x, secondary: oppositePosition.y }
            default:
                return { primary: oppositePosition.y, secondary: oppositePosition.x }
        }
    }
}
