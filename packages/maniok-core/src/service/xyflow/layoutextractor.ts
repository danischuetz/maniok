import { type Node } from '@xyflow/svelte'
import { type RelationshipModel } from '../../model/diagram/relationship'
import { DirectionEnum } from '../../model/shared/direction'
import type { LayoutModel } from '../../model/layout/layout'
import type { LayoutElementModel } from '../../model/layout/layoutelement'
import type { LayoutEdgeModel } from '../../model/layout/layoutedge'

export class LayoutExtractor {
    private static toDimension(value: number | undefined): number | undefined {
        if (value === undefined) return undefined
        if (!Number.isFinite(value) || value <= 0) return undefined
        return value
    }

    static toLayoutModel(
        nodes: Node[],
        relationShips: RelationshipModel[],
        direction: DirectionEnum
    ): LayoutModel {
        const getNodeWidth = (node: Node): number => {
            return this.toDimension(node.measured?.width) ?? this.toDimension(node.width) ?? 10
        }

        const getNodeHeight = (node: Node): number => {
            return this.toDimension(node.measured?.height) ?? this.toDimension(node.height) ?? 10
        }

        const layoutElements: LayoutElementModel[] = nodes.map((node) => ({
            id: node.id,
            parentId: node.parentId,
            x: node.type === 'group' ? 1 : 0,
            y: node.type === 'group' ? 1 : 0,
            width: getNodeWidth(node),
            height: getNodeHeight(node)
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
}
