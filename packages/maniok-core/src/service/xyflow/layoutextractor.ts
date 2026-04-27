import { type Node } from '@xyflow/svelte'
import { type RelationshipModel } from '../../model/diagram/relationship'
import { DirectionEnum } from '../../model/shared/direction'
import type { LayoutModel } from '../../model/layout/layout'
import type { LayoutElementModel } from '../../model/layout/layoutelement'
import type { LayoutEdgeModel } from '../../model/layout/layoutedge'

export class LayoutExtractor {
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
}
