import { type Edge, type Node, Position } from '@xyflow/svelte'
import type { ConnectionModel } from '../../model/diagram/connection'
import { NodePositionResolver } from './nodepositionresolver'

type Point = {
    x: number
    y: number
}

type Rectangle = {
    x: number
    y: number
    width: number
    height: number
}

type EdgeGeometry = {
    sourcePoint: Point
    sourcePosition: Position
    targetPoint: Point
    targetPosition: Position
}

type BezierCurve = {
    source: Point
    sourceControl: Point
    targetControl: Point
    target: Point
}

export type EdgeLabelSize = {
    width: number
    height: number
}

export type EdgeLabelSizeById = Record<string, EdgeLabelSize | undefined>

const LABEL_MIN_DISTANCE = 4
const BEZIER_CURVATURE = 0.25
const SEARCH_STEP = 4
const MAX_SEARCH_RADIUS = 240

const SEARCH_DIRECTIONS: Point[] = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 }
]

export class EdgeLabelPositioner {
    static positionLabels(
        nodes: Node[],
        edges: Edge[],
        measuredLabelSizes: EdgeLabelSizeById = {}
    ): Edge[] {
        const nodeById = new Map(nodes.map((node) => [node.id, node]))
        const nodeObstacles = this.createNodeObstacles(nodes)
        const placedLabelRectangles: Rectangle[] = []

        return edges.map((edge) => {
            const labelText = String(edge.label ?? '').trim()
            if (!labelText) return this.clearLabelPosition(edge)

            const geometry = this.toEdgeGeometry(edge, nodeById)
            if (!geometry) return this.clearLabelPosition(edge)

            const labelSize = this.resolveLabelSize(measuredLabelSizes[edge.id])
            if (!labelSize) return this.clearLabelPosition(edge)

            const curve = this.createBezierCurve(geometry)
            const center = this.getBezierPoint(curve, 0.5)
            const centerRectangle = this.toCenteredRectangle(center, labelSize)

            const candidate = this.findValidPlacement(center, labelSize, nodeObstacles, placedLabelRectangles)
            const chosenPoint = candidate ?? center
            const chosenRectangle = candidate
                ? this.toCenteredRectangle(candidate, labelSize)
                : centerRectangle

            placedLabelRectangles.push(chosenRectangle)

            return {
                ...edge,
                data: {
                    ...(edge.data ?? {}),
                    labelX: chosenPoint.x,
                    labelY: chosenPoint.y
                }
            }
        })
    }

    private static resolveLabelSize(labelSize: EdgeLabelSize | undefined): EdgeLabelSize | undefined {
        if (!labelSize) return undefined

        const width = this.resolveDimension(labelSize.width)
        const height = this.resolveDimension(labelSize.height)
        if (!width || !height) return undefined

        return {
            width,
            height
        }
    }

    private static clearLabelPosition(edge: Edge): Edge {
        const data = (edge.data ?? {}) as Record<string, unknown>

        if (!('labelX' in data) && !('labelY' in data)) {
            return { ...edge }
        }

        const { labelX: _, labelY: __, ...rest } = data

        return {
            ...edge,
            data: rest
        }
    }

    private static createNodeObstacles(nodes: Node[]): Rectangle[] {
        return nodes
            .filter((node) => node.type !== 'group')
            .map((node) => this.toAbsoluteNodeRectangle(node, nodes))
            .filter((rectangle): rectangle is Rectangle => rectangle !== undefined)
    }

    private static toAbsoluteNodeRectangle(node: Node, nodes: Node[]): Rectangle | undefined {
        const width = this.getNodeWidth(node)
        const height = this.getNodeHeight(node)
        if (!width || !height) return undefined

        const position = NodePositionResolver.getAbsoluteNodePosition(node, nodes)

        return {
            x: position.x,
            y: position.y,
            width,
            height
        }
    }

    private static getNodeWidth(node: Node): number | undefined {
        return (
            this.resolveDimension(node.measured?.width) ??
            this.resolveDimension(node.width) ??
            this.resolveDimension((node.data as { layoutWidth?: number }).layoutWidth)
        )
    }

    private static getNodeHeight(node: Node): number | undefined {
        return (
            this.resolveDimension(node.measured?.height) ??
            this.resolveDimension(node.height) ??
            this.resolveDimension((node.data as { layoutHeight?: number }).layoutHeight)
        )
    }

    private static resolveDimension(value: number | undefined): number | undefined {
        if (value === undefined) return undefined
        if (!Number.isFinite(value) || value <= 0) return undefined
        return value
    }

    private static toEdgeGeometry(edge: Edge, nodeById: Map<string, Node>): EdgeGeometry | undefined {
        const sourceNode = nodeById.get(edge.source)
        const targetNode = nodeById.get(edge.target)
        if (!sourceNode || !targetNode) return undefined

        const sourceConnection = this.findConnection(sourceNode, edge.sourceHandle)
        const targetConnection = this.findConnection(targetNode, edge.targetHandle)

        const sourcePosition = this.getConnectionPosition(sourceConnection, Position.Right)
        const targetPosition = this.getConnectionPosition(targetConnection, Position.Left)

        const sourcePoint = this.toConnectionPoint(sourceNode, sourceConnection, sourcePosition, nodeById)
        const targetPoint = this.toConnectionPoint(targetNode, targetConnection, targetPosition, nodeById)

        if (!sourcePoint || !targetPoint) return undefined

        return {
            sourcePoint,
            sourcePosition,
            targetPoint,
            targetPosition
        }
    }

    private static getConnectionPosition(
        connection: ConnectionModel | undefined,
        fallback: Position
    ): Position {
        if (!connection) return fallback

        switch (connection.position) {
            case Position.Top:
                return Position.Top
            case Position.Right:
                return Position.Right
            case Position.Bottom:
                return Position.Bottom
            case Position.Left:
                return Position.Left
            default:
                return fallback
        }
    }

    private static findConnection(node: Node, handleId: string | null | undefined): ConnectionModel | undefined {
        if (!handleId) return undefined
        const connections = (node.data.connections as ConnectionModel[] | undefined) ?? []
        return connections.find((connection) => connection.id === handleId)
    }

    private static toConnectionPoint(
        node: Node,
        connection: ConnectionModel | undefined,
        position: Position,
        nodeById: Map<string, Node>
    ): Point | undefined {
        const allNodes = Array.from(nodeById.values())
        const absoluteNodePosition = NodePositionResolver.getAbsoluteNodePosition(node, allNodes)
        const width = this.getNodeWidth(node)
        const height = this.getNodeHeight(node)
        if (!width || !height) return undefined

        const connections = (node.data.connections as ConnectionModel[] | undefined) ?? []
        const sideConnections = connections.filter((candidate) => candidate.position === position)
        const connectionIndex =
            connection === undefined
                ? -1
                : sideConnections.findIndex((candidate) => candidate.id === connection.id)

        const offset = this.getConnectionOffset({
            position,
            width,
            height,
            sideConnectionCount: sideConnections.length,
            sideConnectionIndex: connectionIndex
        })

        switch (position) {
            case Position.Top:
                return {
                    x: absoluteNodePosition.x + offset,
                    y: absoluteNodePosition.y
                }
            case Position.Right:
                return {
                    x: absoluteNodePosition.x + width,
                    y: absoluteNodePosition.y + offset
                }
            case Position.Bottom:
                return {
                    x: absoluteNodePosition.x + offset,
                    y: absoluteNodePosition.y + height
                }
            case Position.Left:
                return {
                    x: absoluteNodePosition.x,
                    y: absoluteNodePosition.y + offset
                }
        }
    }

    private static getConnectionOffset(params: {
        position: Position
        width: number
        height: number
        sideConnectionCount: number
        sideConnectionIndex: number
    }): number {
        const mainDimension =
            params.position === Position.Top || params.position === Position.Bottom
                ? params.width
                : params.height

        if (params.sideConnectionCount <= 0 || params.sideConnectionIndex < 0) {
            return mainDimension / 2
        }

        return ((params.sideConnectionIndex + 1) * mainDimension) / (params.sideConnectionCount + 1)
    }

    private static createBezierCurve(geometry: EdgeGeometry): BezierCurve {
        return {
            source: geometry.sourcePoint,
            sourceControl: this.getBezierControlPoint({
                from: geometry.sourcePoint,
                fromPosition: geometry.sourcePosition,
                to: geometry.targetPoint
            }),
            targetControl: this.getBezierControlPoint({
                from: geometry.targetPoint,
                fromPosition: geometry.targetPosition,
                to: geometry.sourcePoint
            }),
            target: geometry.targetPoint
        }
    }

    private static getBezierControlPoint(params: {
        from: Point
        fromPosition: Position
        to: Point
    }): Point {
        if (params.fromPosition === Position.Left || params.fromPosition === Position.Right) {
            const direction = params.fromPosition === Position.Left ? -1 : 1
            const delta = Math.abs(params.from.x - params.to.x) * BEZIER_CURVATURE

            return {
                x: params.from.x + direction * delta,
                y: params.from.y
            }
        }

        const direction = params.fromPosition === Position.Top ? -1 : 1
        const delta = Math.abs(params.from.y - params.to.y) * BEZIER_CURVATURE

        return {
            x: params.from.x,
            y: params.from.y + direction * delta
        }
    }

    private static getBezierPoint(curve: BezierCurve, t: number): Point {
        const oneMinusT = 1 - t

        return {
            x:
                oneMinusT ** 3 * curve.source.x +
                3 * oneMinusT ** 2 * t * curve.sourceControl.x +
                3 * oneMinusT * t ** 2 * curve.targetControl.x +
                t ** 3 * curve.target.x,
            y:
                oneMinusT ** 3 * curve.source.y +
                3 * oneMinusT ** 2 * t * curve.sourceControl.y +
                3 * oneMinusT * t ** 2 * curve.targetControl.y +
                t ** 3 * curve.target.y
        }
    }

    private static findValidPlacement(
        center: Point,
        labelSize: EdgeLabelSize,
        nodeObstacles: Rectangle[],
        placedLabelRectangles: Rectangle[]
    ): Point | undefined {
        const centerRect = this.toCenteredRectangle(center, labelSize)
        if (this.isPlacementValid(centerRect, nodeObstacles, placedLabelRectangles)) {
            return center
        }

        for (let radius = SEARCH_STEP; radius <= MAX_SEARCH_RADIUS; radius += SEARCH_STEP) {
            for (const direction of SEARCH_DIRECTIONS) {
                const candidate = {
                    x: center.x + direction.x * radius,
                    y: center.y + direction.y * radius
                }
                const candidateRect = this.toCenteredRectangle(candidate, labelSize)

                if (this.isPlacementValid(candidateRect, nodeObstacles, placedLabelRectangles)) {
                    return candidate
                }
            }
        }

        return undefined
    }

    private static isPlacementValid(
        labelRect: Rectangle,
        nodeObstacles: Rectangle[],
        placedLabelRectangles: Rectangle[]
    ): boolean {
        return (
            !this.overlapsAny(labelRect, nodeObstacles, LABEL_MIN_DISTANCE) &&
            !this.overlapsAny(labelRect, placedLabelRectangles, LABEL_MIN_DISTANCE)
        )
    }

    private static toCenteredRectangle(center: Point, size: EdgeLabelSize): Rectangle {
        return {
            x: center.x - size.width / 2,
            y: center.y - size.height / 2,
            width: size.width,
            height: size.height
        }
    }

    private static overlapsAny(rectangle: Rectangle, obstacles: Rectangle[], margin: number): boolean {
        return obstacles.some((obstacle) =>
            this.overlaps(rectangle, this.expandRectangle(obstacle, margin))
        )
    }

    private static expandRectangle(rectangle: Rectangle, margin: number): Rectangle {
        return {
            x: rectangle.x - margin,
            y: rectangle.y - margin,
            width: rectangle.width + margin * 2,
            height: rectangle.height + margin * 2
        }
    }

    private static overlaps(left: Rectangle, right: Rectangle): boolean {
        const horizontalOverlap = Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x)
        const verticalOverlap = Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y)

        return horizontalOverlap > 0 && verticalOverlap > 0
    }
}
