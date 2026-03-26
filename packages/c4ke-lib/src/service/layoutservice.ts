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
    top: 30,
    right: 10,
    bottom: 10,
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

    private updateElements(elements: LayoutElementModel[], graph: Dagre.graphlib.Graph): void {
        elements.forEach((element) => {
            const node = graph.node(element.id)
            element.x = node.x - element.width / 2
            element.y = node.y - element.height / 2
        })
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
