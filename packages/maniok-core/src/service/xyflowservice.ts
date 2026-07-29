import { type Node, type Edge } from '@xyflow/svelte'
import { type RelationshipModel } from '../model/diagram/relationship'
import { DirectionEnum } from '../model/shared/direction'
import type { LayoutModel } from '../model/layout/layout'
import type { DiagramModel } from '../model/diagram/diagrammodel'
import { NodeMapper } from './xyflow/nodemapper'
import { EdgeMapper } from './xyflow/edgemapper'
import { LayoutExtractor } from './xyflow/layoutextractor'
import { ConnectionPositioner } from './xyflow/connectionpositioner'
import { EdgeLabelPositioner, type EdgeLabelSizeById } from './xyflow/edgelabelpositioner'

export type { EdgeLabelSize, EdgeLabelSizeById } from './xyflow/edgelabelpositioner'

export class XYFlowService {
    static toNodesAndEdges(diagram: DiagramModel): { nodes: Node[]; edges: Edge[] } {
        const nodes = NodeMapper.toNodes(diagram.elements)
        const edges = EdgeMapper.toEdges(nodes, diagram.relationships)
        return { nodes, edges }
    }

    static applyLayoutToNodes(nodes: Node[], layoutModel: LayoutModel): Node[] {
        return NodeMapper.applyLayoutToNodes(nodes, layoutModel)
    }

    static toLayoutModel(
        nodes: Node[],
        relationShips: RelationshipModel[],
        direction: DirectionEnum
    ): LayoutModel {
        return LayoutExtractor.toLayoutModel(nodes, relationShips, direction)
    }

    static setSourceAndTargetPositions(
        nodes: Node[],
        edges: Edge[],
        direction: DirectionEnum
    ): { nodes: Node[]; edges: Edge[] } {
        return ConnectionPositioner.setSourceAndTargetPositions(nodes, edges, direction)
    }

    static positionEdgeLabels(
        nodes: Node[],
        edges: Edge[],
        measuredLabelSizes: EdgeLabelSizeById = {}
    ): Edge[] {
        return EdgeLabelPositioner.positionLabels(nodes, edges, measuredLabelSizes)
    }
}
