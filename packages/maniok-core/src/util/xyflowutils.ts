import { type Node, type Edge, Position, MarkerType } from '@xyflow/svelte'
import { type ElementModel } from '../model/diagram/element'
import { type RelationshipModel } from '../model/diagram/relationship'
import { DirectionEnum } from '../model/shared/direction'
import type { LayoutModel } from '../model/layout/layout'
import type { LayoutElementModel } from '../model/layout/layoutelement'
import type { LayoutEdgeModel } from '../model/layout/layoutedge'
import type { DiagramModel } from '../model/diagram/diagrammodel'
import { ElementTypeEnum } from '../model/shared/elementtype'
import type { ConnectionModel } from '../model/diagram/connection'

export class XYFlowUtils {
    static toNodesAndEdges(diagram: DiagramModel): { nodes: Node[]; edges: Edge[] } {
        const nodes = this.toNodes(diagram.elements)
        const edges = this.toEdges(nodes, diagram.relationships)
        return { nodes, edges }
    }

    static applyLayoutToNodes(nodes: Node[], layoutModel: LayoutModel): Node[] {
        return nodes.map((node) => {
            const layoutElement = layoutModel.layoutElements.find((e) => e.id === node.id)!
            return {
                ...node,
                position: {
                    x: layoutElement.x,
                    y: layoutElement.y
                },
                width: layoutElement.width,
                height: layoutElement.height
            }
        })
    }

    static toLayoutModel(
        nodes: Node[],
        relationShips: RelationshipModel[],
        direction: DirectionEnum
    ): LayoutModel {
        const layoutElements: LayoutElementModel[] = nodes.map((node) => ({
            id: node.id,
            parentId: node.parentId,
            x: node.type === 'group' ? 1 : 0,
            y: node.type === 'group' ? 1 : 0,
            width: node.measured?.width ?? 10,
            height: node.measured?.height ?? 10
        }))

        const layoutEdges: LayoutEdgeModel[] = relationShips.map((relationship) => ({
            sourceId: relationship.sourceId,
            targetId: relationship.targetId
        }))

        return {
            layoutElements,
            layoutEdges,
            direction
        }
    }

    static toNodes(elements: ElementModel[], parentId?: string): Node[] {
        let nodes: Node[] = []
        for (const element of elements) {
            const type: string =
                element.metaData.type == ElementTypeEnum.Person
                    ? 'person'
                    : element.children.length > 0
                      ? 'group'
                      : 'element'

            nodes.push({
                id: element.id,
                parentId: parentId,
                type: type,
                data: {
                    metaData: {
                        ...element.metaData,
                        external: parentId == undefined
                    }
                },
                position: {
                    x: 0,
                    y: 0
                },
                width: 0,
                height: 0,
                draggable: false
            })

            if (element.children.length > 0) {
                nodes = [...nodes, ...this.toNodes(element.children, element.id)]
            }
        }
        return nodes
    }

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
                type: 'source',
                index: sourceIndex
            })

            connections.get(targetNode)!.push({
                id: targetId,
                position: Position.Left,
                type: 'target',
                index: targetIndex
            })

            return {
                id: relationship.id,
                source: sourceNode.id,
                target: targetNode.id,
                sourceHandle: sourceId,
                targetHandle: targetId,
                label: relationship.description ?? '',
                type: 'bezier',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: 'var(--color-surface-950-50)',
                    strokeWidth: 1
                }
            }
        })

        connections.forEach((conns, node) => {
            node.data.connections = conns
        })

        return edges
    }

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
                sourceNode!,
                targetNode!,
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
        const sourcePosition = this.getAbsoluteNodePosition(sourceNode, nodes)
        const targetPosition = this.getAbsoluteNodePosition(targetNode, nodes)

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

    static getAbsoluteNodePosition(node: Node, nodes: Node[]): { x: number; y: number } {
        let x = node.position.x
        let y = node.position.y
        let parentId = node.parentId

        while (parentId) {
            const parentNode = nodes.find((candidate) => candidate.id === parentId)
            if (!parentNode) break

            x += parentNode.position.x
            y += parentNode.position.y
            parentId = parentNode.parentId
        }

        return { x, y }
    }
}
