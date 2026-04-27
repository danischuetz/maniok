import { type Node } from '@xyflow/svelte'
import { type ElementModel } from '../../model/diagram/element'
import { ElementTypeEnum } from '../../model/shared/elementtype'
import type { LayoutModel } from '../../model/layout/layout'

export class NodeMapper {
    static toNodes(elements: ElementModel[], parentId?: string): Node[] {
        let nodes: Node[] = []
        for (const element of elements) {
            const type: string =
                element.metaData.type == ElementTypeEnum.Person
                    ? 'person'
                    : element.children.length > 0
                      ? 'group'
                      : 'element'

            nodes.push({
                id: element.id,
                parentId: parentId,
                type: type,
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
}
