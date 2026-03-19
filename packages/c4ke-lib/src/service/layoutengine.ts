import Dagre from '@dagrejs/dagre'
import { Direction } from '../model/shared/direction'
import type { LayoutModel } from '../model/layout/layoutmodel'
import type { LayoutElement } from '../model/layout/layoutelement'
import type { LayoutEdge } from '../model/layout/layoutedge'

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
    layout(layoutModel: LayoutModel) {
        const graph = new Dagre.graphlib.Graph({
            compound: true
        })

        graph.setGraph({
            rankdir: layoutModel.direction,
            ranksep:
                layoutModel.direction === Direction.LeftRight ||
                layoutModel.direction === Direction.RightLeft
                    ? 40
                    : 30,
            ranker: 'network-simplex', // network-simplex, tight-tree or longest-path
            align: 'UL'
        })

        graph.setDefaultEdgeLabel(() => ({}))

        this.addEdges(graph, layoutModel.layoutEdges)
        this.addElements(graph, layoutModel.layoutElements)

        Dagre.layout(graph)

        this.updateElements(layoutModel.layoutElements, graph)
        this.fitGroups(layoutModel.layoutElements, graph)
    }

    private addEdges(graph: Dagre.graphlib.Graph, edges: LayoutEdge[]): void {
        edges.forEach((edge) =>
            graph.setEdge(edge.sourceId, edge.targetId, {
                minlen: 5
            })
        )
    }

    private addElements(graph: Dagre.graphlib.Graph, elements: LayoutElement[]): void {
        elements.forEach((element) => {
            graph.setNode(element.id, {
                width: element.width,
                height: element.height
            })
            if (element.parentId) graph.setParent(element.id, element.parentId)
        })
    }

    private updateElements(elements: LayoutElement[], graph: Dagre.graphlib.Graph): void {
        elements.forEach((element) => {
            const node = graph.node(element.id)
            element.x = node.x - element.width / 2
            element.y = node.y - element.height / 2
        })
    }

    private fitGroups(elements: LayoutElement[], graph: Dagre.graphlib.Graph): void {
        const groups = elements.filter((e) => graph.children(e.id).length > 0)
        groups.forEach((group) => {
            const children: LayoutElement[] = elements.filter((e) => e.parentId === group.id)
            let bounds = this.calculateBounds(children)
            bounds = this.applyMargin(bounds)

            group.x = bounds.minX
            group.y = bounds.minY
            group.width = bounds.maxX
            group.height = bounds.maxY
        })
    }

    private calculateBounds(elements: LayoutElement[]): Bounds {
        const minX = Math.min(...elements.map((element) => element.x))
        const minY = Math.min(...elements.map((element) => element.y))
        const maxX = Math.max(...elements.map((element) => element.x + element.width))
        const maxY = Math.max(...elements.map((element) => element.y + element.height))

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
