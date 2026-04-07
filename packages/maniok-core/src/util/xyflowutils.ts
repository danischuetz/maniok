import { type Node, type Edge, Position, MarkerType } from '@xyflow/svelte'
import { type ElementModel } from '../model/diagram/element'
import { type RelationshipModel } from '../model/diagram/relationship'
import { DirectionEnum } from '../model/shared/direction'
import type { LayoutModel } from '../model/layout/layout'
import type { LayoutElementModel } from '../model/layout/layoutelement'
import type { LayoutEdgeModel } from '../model/layout/layoutedge'
import type { DiagramModel } from '../model/diagram/diagrammodel'

export class XYFlowUtils {
    static toNodesAndEdges(diagram: DiagramModel): { nodes: Node[]; edges: Edge[] } {
        const nodes = this.toNodes(diagram.elements)
        const edges = this.toEdges(diagram.relationships)
        this.setSourceAndTargetPositions(nodes, edges, diagram.direction)
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

    static toLayoutModel(nodes: Node[], edges: Edge[], direction: DirectionEnum): LayoutModel {
        const layoutElements: LayoutElementModel[] = nodes.map((node) => ({
            id: node.id,
            parentId: node.parentId,
            x: node.type === 'group' ? 1 : 0,
            y: node.type === 'group' ? 1 : 0,
            width: node.measured?.width ?? 10,
            height: node.measured?.height ?? 10
        }))

        const layoutEdges: LayoutEdgeModel[] = edges.map((edge) => ({
            sourceId: edge.source,
            targetId: edge.target
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
            nodes.push({
                id: element.id,
                parentId: parentId,
                type: element.children.length > 0 ? 'group' : 'element',
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

    static toEdges(relationships: RelationshipModel[]): Edge[] {
        return relationships.map((relationship) => ({
            id: relationship.id,
            source: relationship.sourceId,
            target: relationship.targetId,
            label: relationship.description ?? '',
            type: 'bezier',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: 'var(--color-surface-950-50)',
                strokeWidth: 1
            }
        }))
    }

    static setSourceAndTargetPositions(
        nodes: Node[],
        edges: Edge[],
        direction: DirectionEnum
    ): void {
        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)
            const targetNode = nodes.find((node) => node.id === edge.target)

            switch (direction) {
                case DirectionEnum.LeftRight:
                    sourceNode!.sourcePosition = Position.Right
                    targetNode!.targetPosition = Position.Left
                    break
                case DirectionEnum.RightLeft:
                    sourceNode!.sourcePosition = Position.Left
                    targetNode!.targetPosition = Position.Right
                    break
                case DirectionEnum.TopBottom:
                    sourceNode!.sourcePosition = Position.Bottom
                    targetNode!.targetPosition = Position.Top
                    break
                case DirectionEnum.BottomTop:
                    sourceNode!.sourcePosition = Position.Top
                    targetNode!.targetPosition = Position.Bottom
                    break
            }
        })
    }
}
