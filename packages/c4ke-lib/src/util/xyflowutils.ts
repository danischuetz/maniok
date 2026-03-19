import { type Node, type Edge, Position } from '@xyflow/svelte'
import { type Element } from '../model/diagram/element'
import { type Relationship } from '../model/diagram/relationship'
import { Direction } from '../model/shared/direction'
import type { LayoutModel } from '../model/layout/layoutmodel'
import type { LayoutElement } from '../model/layout/layoutelement'
import type { LayoutEdge } from '../model/layout/layoutedge'
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

    static toLayoutModel(nodes: Node[], edges: Edge[], direction: Direction): LayoutModel {
        const layoutElements: LayoutElement[] = nodes.map((node) => ({
            id: node.id,
            parentId: node.parentId,
            x: node.type === 'group' ? 1 : 0,
            y: node.type === 'group' ? 1 : 0,
            width: node.measured?.width ?? 10,
            height: node.measured?.height ?? 10
        }))

        const layoutEdges: LayoutEdge[] = edges.map((edge) => ({
            sourceId: edge.source,
            targetId: edge.target
        }))

        return {
            layoutElements,
            layoutEdges,
            direction
        }
    }

    static toNodes(elements: Element[], parentId?: string): Node[] {
        let nodes: Node[] = []
        for (const element of elements) {
            nodes.push({
                id: element.id,
                parentId: parentId,
                type: element.children.length > 0 ? 'group' : 'element',
                data: {
                    metaData: element.metaData
                },
                position: {
                    x: 0,
                    y: 0
                },
                width: 0,
                height: 0
            })

            if (element.children.length > 0) {
                nodes = [...nodes, ...this.toNodes(element.children, element.id)]
            }
        }
        return nodes
    }

    static toEdges(relationships: Relationship[]): Edge[] {
        return relationships.map((relationship) => ({
            id: relationship.id,
            source: relationship.sourceId,
            target: relationship.targetId,
            label: relationship.description ?? ''
        }))
    }

    static setSourceAndTargetPositions(nodes: Node[], edges: Edge[], direction: Direction): void {
        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)
            const targetNode = nodes.find((node) => node.id === edge.target)

            switch (direction) {
                case Direction.LeftRight:
                    sourceNode!.sourcePosition = Position.Right
                    targetNode!.targetPosition = Position.Left
                    break
                case Direction.RightLeft:
                    sourceNode!.sourcePosition = Position.Left
                    targetNode!.targetPosition = Position.Right
                    break
                case Direction.TopBottom:
                    sourceNode!.sourcePosition = Position.Bottom
                    targetNode!.targetPosition = Position.Top
                    break
                case Direction.BottomTop:
                    sourceNode!.sourcePosition = Position.Top
                    targetNode!.targetPosition = Position.Bottom
                    break
            }
        })
    }
}
