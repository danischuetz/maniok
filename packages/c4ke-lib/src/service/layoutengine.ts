import Dagre from '@dagrejs/dagre'
import { Direction, type DiagramModel, type Element, type Relationship } from '../../dist/index'

interface Bounds {
    minX: number
    minY: number
    maxX: number
    maxY: number
}

const margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 10
}

export class LayoutEngine {
    layout(diagram: DiagramModel) {
        const graph = new Dagre.graphlib.Graph({
            compound: true
        })

        graph.setGraph({
            rankdir: diagram.direction,
            ranksep:
                diagram.direction === Direction.LeftRight ||
                diagram.direction === Direction.RightLeft
                    ? 40
                    : 30,
            ranker: 'network-simplex', // network-simplex, tight-tree or longest-path
            align: 'UL'
        })

        graph.setDefaultEdgeLabel(() => ({}))

        this.addRelationships(graph, diagram.relationships)
        this.addElements(graph, diagram.elements)

        Dagre.layout(graph)

        this.updateElements(diagram.elements, graph)
        diagram.elements.forEach((element) => this.fitAroundChildren(element))
    }

    private addRelationships(graph: Dagre.graphlib.Graph, relationships: Relationship[]): void {
        relationships.forEach((relationship) =>
            graph.setEdge(relationship.sourceId, relationship.targetId, {
                minlen: 5
            })
        )
    }

    private addElements(graph: Dagre.graphlib.Graph, elements: Element[], parentId?: string): void {
        elements.forEach((element) => {
            graph.setNode(element.id, {
                ...element,
                width: element.width,
                height: element.height
            })
            if (parentId) graph.setParent(element.id, parentId)
            if (element.children.length > 0) {
                this.addElements(graph, element.children, element.id)
            }
        })
    }

    private updateElements(elements: Element[], graph: Dagre.graphlib.Graph): void {
        elements.forEach((element) => {
            const node = graph.node(element.id)
            if (node) this.updateElementCoordinates(element, node)
            if (element.children.length > 0) {
                this.updateElements(element.children, graph)
            }
        })
    }

    private updateElementCoordinates(element: Element, node: Dagre.Node): void {
        element.x = node.x - element.width / 2
        element.y = node.y - element.height / 2
    }

    private fitAroundChildren(element: Element): void {
        if (element.children.length > 0) {
            for (const child of element.children) {
                this.fitAroundChildren(child)
            }
            const bounds = this.calculateBounds(element.children)
            this.applyMargin(bounds)
            element.x = bounds.minX
            element.y = bounds.minY
            element.width = bounds.maxX - bounds.minX
            element.height = bounds.maxY - bounds.minY
        }
    }

    private calculateBounds(children: Element[]): Bounds {
        const minX = Math.min(...children.map((child) => child.x))
        const minY = Math.min(...children.map((child) => child.y))
        const maxX = Math.max(...children.map((child) => child.x + child.width))
        const maxY = Math.max(...children.map((child) => child.y + child.height))

        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY
        }
    }

    private applyMargin(bounds: Bounds): Bounds {
        return {
            minX: bounds.minX - margin.left,
            minY: bounds.minY - margin.top,
            maxX: bounds.maxX + margin.right,
            maxY: bounds.maxY + margin.bottom
        }
    }

    // private collectGroups(nodes: Node[]): Group[] {
    //     return nodes
    //         .filter((node) => node.type === 'customgroup')
    //         .map((groupNode) => ({
    //             node: groupNode,
    //             children: nodes.filter((node) => node.parentId === groupNode.id)
    //         }))
    // }

    // private calculateGroupBounds(group: Group, margin: Margin): Bounds {
    //     const { children } = group
    //     if (children.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }

    //     const minX = Math.min(...children.map((child) => child.position.x))
    //     const minY = Math.min(...children.map((child) => child.position.y))
    //     const maxX = Math.max(
    //         ...children.map(
    //             (child) => child.position.x + (child.width ?? child.measured?.width ?? 0)
    //         )
    //     )
    //     const maxY = Math.max(
    //         ...children.map(
    //             (child) => child.position.y + (child.height ?? child.measured?.height ?? 0)
    //         )
    //     )
    //     return {
    //         minX: minX - margin.left,
    //         minY: minY - margin.top,
    //         maxX: maxX + margin.right,
    //         maxY: maxY + margin.bottom
    //     }
    // }

    // private getGroupDepth(groupId: string, nodes: Node[]): number {
    //     const group = nodes.find((n) => n.id === groupId)
    //     if (!group || !group.parentId) return 0
    //     return 1 + this.getGroupDepth(group.parentId, nodes)
    // }

    // private fitGroupsAroundChildren(nodes: Node[]): Node[] {
    //     const groups: Group[] = this.collectGroups(nodes)
    //     const updatedNodes = [...nodes]

    //     // Sort groups by depth (deepest first) to process nested groups from inside out
    //     const sortedGroups = groups.sort((a, b) => {
    //         const depthA = this.getGroupDepth(a.node.id, nodes)
    //         const depthB = this.getGroupDepth(b.node.id, nodes)
    //         return depthB - depthA // Deeper groups first
    //     })

    //     sortedGroups.forEach((group: Group) => {
    //         // Get current children from updatedNodes to use latest positions
    //         const currentChildren = updatedNodes.filter((n) => n.parentId === group.node.id)
    //         const groupWithCurrentChildren = {
    //             node: group.node,
    //             children: currentChildren
    //         }

    //         const bounds: Bounds = this.calculateGroupBounds(
    //             groupWithCurrentChildren,
    //             defaultMargin
    //         )

    //         const nodeIndex = updatedNodes.findIndex((n) => n.id === group.node.id)
    //         if (nodeIndex !== -1) {
    //             updatedNodes[nodeIndex] = {
    //                 ...updatedNodes[nodeIndex],
    //                 position: { x: bounds.minX, y: bounds.minY },
    //                 width: bounds.maxX - bounds.minX,
    //                 height: bounds.maxY - bounds.minY
    //             }
    //         }

    //         // Convert children positions to be relative to the group
    //         currentChildren.forEach((child) => {
    //             const childIndex = updatedNodes.findIndex((n) => n.id === child.id)
    //             if (childIndex !== -1) {
    //                 updatedNodes[childIndex] = {
    //                     ...updatedNodes[childIndex],
    //                     position: {
    //                         x: child.position.x - bounds.minX,
    //                         y: child.position.y - bounds.minY
    //                     }
    //                 }
    //             }
    //         })
    //     })

    //     return updatedNodes
    // }
}
