import { type Node, type Edge, Position } from "@xyflow/svelte"
import { type Element, type Relationship, Direction } from "../../dist/index.js"

export class XYFlow {
    static toNodes(elements: Element[], parentId?: string): Node[] {
        let nodes: Node[] = []
        for (const element of elements) {
            nodes.push({
                id: element.id,
                parentId: parentId,
                data: {
                    metadata: element.metadata,
                },
                position: {
                    x: element.position.x,
                    y: element.position.y,
                },
                width: element.size.width,
                height: element.size.height,
            })

            if (element.children.length > 0) {
                nodes = [nodes, ...this.toNodes(element.children, element.id)]
            }
        }
        return nodes
    }

    static toEdges(relationships: Relationship[]): Edge[] {
        return relationships.map(relationship => ({
            id: relationship.id,
            source: relationship.sourceId,
            target: relationship.targetId,
            label: relationship.description ?? "",
        }))
    }

    static setSourceAndTargetPositions(
        nodes: Node[],
        edges: Edge[],
        direction: Direction,
    ): void {
        edges.forEach(edge => {
            const sourceNode = nodes.find(node => node.id === edge.source)
            const targetNode = nodes.find(node => node.id === edge.target)

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
