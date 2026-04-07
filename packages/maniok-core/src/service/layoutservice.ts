import Dagre from '@dagrejs/dagre'
import { DirectionEnum } from '../model/shared/direction'
import type { LayoutModel } from '../model/layout/layout'
import type { LayoutElementModel } from '../model/layout/layoutelement'
import type { LayoutEdgeModel } from '../model/layout/layoutedge'

interface Bounds {
    minX: number
    minY: number
    maxX: number
    maxY: number
}

const margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 10
}

export class LayoutService {
    layout(layoutModel: LayoutModel) {
        const graph = new Dagre.graphlib.Graph({
            compound: true
        })

        graph.setGraph({
            rankdir: layoutModel.direction,
            ranksep:
                layoutModel.direction === DirectionEnum.LeftRight ||
                layoutModel.direction === DirectionEnum.RightLeft
                    ? 30
                    : 20,
            ranker: 'network-simplex', // network-simplex, tight-tree or longest-path
            align: 'UL'
        })

        graph.setDefaultEdgeLabel(() => ({}))

        this.addEdges(graph, layoutModel.layoutEdges)
        this.addElements(graph, layoutModel.layoutElements)

        Dagre.layout(graph)

        this.updateElements(layoutModel, graph)
        this.alignElements(layoutModel, graph)
        this.fitGroups(layoutModel.layoutElements, graph)
    }

    private addEdges(graph: Dagre.graphlib.Graph, edges: LayoutEdgeModel[]): void {
        edges.forEach((edge) =>
            graph.setEdge(edge.sourceId, edge.targetId, {
                minlen: 5
            })
        )
    }

    private addElements(graph: Dagre.graphlib.Graph, elements: LayoutElementModel[]): void {
        elements.forEach((element) => {
            graph.setNode(element.id, {
                width: element.width,
                height: element.height
            })
            if (element.parentId) graph.setParent(element.id, element.parentId)
        })
    }

    private updateElements(layoutModel: LayoutModel, graph: Dagre.graphlib.Graph): void {
        layoutModel.layoutElements.forEach((element) => {
            const node = graph.node(element.id)

            element.x = node.x - element.width / 2
            element.y = node.y - element.height / 2
        })
    }

    private alignElements(layoutModel: LayoutModel, graph: Dagre.graphlib.Graph): void {
        const ranks: Map<number, LayoutElementModel[]> = new Map()

        graph.nodes().forEach((nodeId) => {
            const node = graph.node(nodeId)
            if (node.rank === undefined) return

            const element = layoutModel.layoutElements.find((e) => e.id === nodeId)!
            const rank = Math.floor(node.rank / 10)

            if (!ranks.has(rank)) ranks.set(rank, [])
            ranks.get(rank)!.push(element)
        })

        switch (layoutModel.direction) {
            case DirectionEnum.LeftRight:
                ranks.forEach((elements) => {
                    const averageLeft = elements.reduce((sum, e) => sum + e.x, 0) / elements.length
                    elements.forEach((e) => (e.x = averageLeft))
                })
                break
            case DirectionEnum.RightLeft:
                ranks.forEach((elements) => {
                    const averageRight =
                        elements.reduce((sum, e) => sum + e.x + e.width, 0) / elements.length
                    elements.forEach((e) => (e.x = averageRight - e.width))
                })
                break
            case DirectionEnum.TopBottom:
                ranks.forEach((elements) => {
                    const averageTop = elements.reduce((sum, e) => sum + e.y, 0) / elements.length
                    elements.forEach((e) => (e.y = averageTop))
                })
                break
            case DirectionEnum.BottomTop:
                ranks.forEach((elements) => {
                    const averageBottom =
                        elements.reduce((sum, e) => sum + e.y + e.height, 0) / elements.length
                    elements.forEach((e) => (e.y = averageBottom - e.height))
                })
                break
        }
    }

    private fitGroups(elements: LayoutElementModel[], graph: Dagre.graphlib.Graph): void {
        let groups: LayoutElementModel[] = elements.filter((e) => graph.children(e.id).length > 0)

        groups.reverse().forEach((group) => {
            const children: LayoutElementModel[] = elements.filter((e) => e.parentId === group.id)
            let bounds = this.calculateBounds(children)
            bounds = this.applyMargin(bounds)

            group.x = bounds.minX
            group.y = bounds.minY
            group.width = bounds.maxX - bounds.minX
            group.height = bounds.maxY - bounds.minY

            children.forEach((child) => {
                child.x = child.x - bounds.minX
                child.y = child.y - bounds.minY
            })
        })
    }

    private calculateBounds(elements: LayoutElementModel[]): Bounds {
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
}
