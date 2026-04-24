import type { Node } from '@xyflow/svelte'

export class NodePositionResolver {
    static getAbsoluteNodePosition(node: Node, nodes: Node[]): { x: number; y: number } {
        let x = node.position.x
        let y = node.position.y
        let parentId = node.parentId

        while (parentId) {
            const parentNode = nodes.find((candidate) => candidate.id === parentId)
            if (!parentNode) break

            x += parentNode.position.x
            y += parentNode.position.y
            parentId = parentNode.parentId
        }

        return { x, y }
    }
}
