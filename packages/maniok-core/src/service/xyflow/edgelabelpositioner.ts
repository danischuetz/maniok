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

type EdgeLabelData = {
    labelX?: number
    labelY?: number
}

type EdgeLabelPlacement = {
    point: Point
    score: number
    rectangle: Rectangle
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

type LabelEstimate = {
    width: number
    height: number
}

const LABEL_MAX_WIDTH = 112
const LABEL_CHARACTER_WIDTH = 6
const LABEL_LINE_HEIGHT = 16
const LABEL_HORIZONTAL_INSET = 6
const LABEL_VERTICAL_INSET = 6
const BEZIER_CURVATURE = 0.25

const NODE_OVERLAP_WEIGHT = 1_000_000
const LABEL_OVERLAP_WEIGHT = 100_000
const DISPLACEMENT_WEIGHT = 0.02
const EDGE_NODE_MARGIN = 2

const BASE_CANDIDATE_FACTORS = [0.35, 0.5, 0.65]
const CANDIDATE_NORMAL_OFFSETS = [0, 18, -18, 36, -36, 52, -52]

export class EdgeLabelPositioner {
    static positionLabels(nodes: Node[], edges: Edge[]): Edge[] {
        const nodeById = new Map(nodes.map((node) => [node.id, node]))
        const nodeObstacles = this.createNodeObstacles(nodes)
        const placedLabelRectangles: Rectangle[] = []

        return edges.map((edge) => {
            const labelText = String(edge.label ?? '').trim()
            if (!labelText) return { ...edge }

            const geometry = this.toEdgeGeometry(edge, nodeById)
            if (!geometry) return { ...edge }

            const labelEstimate = this.estimateLabelBox(labelText)
            const curve = this.createBezierCurve(geometry)
            const defaultPoint = this.getBezierPoint(curve, 0.5)
            const candidates = this.createCandidates(curve)
            const bestPlacement = this.pickBestPlacement({
                candidates,
                labelEstimate,
                defaultPoint,
                nodeObstacles,
                placedLabelRectangles
            })

            placedLabelRectangles.push(bestPlacement.rectangle)

            return {
                ...edge,
                data: {
                    ...(edge.data ?? {}),
                    labelX: bestPlacement.point.x,
                    labelY: bestPlacement.point.y
                }
            }
        })
    }

    private static createNodeObstacles(nodes: Node[]): Rectangle[] {
        return nodes
            .map((node) => {
                const nodeRectangle = this.toAbsoluteNodeRectangle(node, nodes)
                if (!nodeRectangle) return undefined

                return {
                    x: nodeRectangle.x - EDGE_NODE_MARGIN,
                    y: nodeRectangle.y - EDGE_NODE_MARGIN,
                    width: nodeRectangle.width + EDGE_NODE_MARGIN * 2,
                    height: nodeRectangle.height + EDGE_NODE_MARGIN * 2
                }
            })
            .filter((rectangle): rectangle is Rectangle => rectangle !== undefined)
    }

    private static toAbsoluteNodeRectangle(node: Node, nodes: Node[]): Rectangle | undefined {
        const width = this.getNodeWidth(node)
        const height = this.getNodeHeight(node)
        if (width <= 0 || height <= 0) return undefined

        const position = NodePositionResolver.getAbsoluteNodePosition(node, nodes)

        return {
            x: position.x,
            y: position.y,
            width,
            height
        }
    }

    private static getNodeWidth(node: Node): number {
        return this.resolveDimension(node.measured?.width) ??
            this.resolveDimension(node.width) ??
            this.resolveDimension((node.data as { layoutWidth?: number }).layoutWidth) ??
            0
    }

    private static getNodeHeight(node: Node): number {
        return this.resolveDimension(node.measured?.height) ??
            this.resolveDimension(node.height) ??
            this.resolveDimension((node.data as { layoutHeight?: number }).layoutHeight) ??
            0
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
        if (width <= 0 || height <= 0) return undefined

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

    private static estimateLabelBox(labelText: string): LabelEstimate {
        const charactersPerLine = Math.max(
            1,
            Math.floor((LABEL_MAX_WIDTH - LABEL_HORIZONTAL_INSET) / LABEL_CHARACTER_WIDTH)
        )
        const labelLength = labelText.length
        const lineCount = Math.max(1, Math.ceil(labelLength / charactersPerLine))

        return {
            width: Math.min(
                LABEL_MAX_WIDTH,
                Math.max(
                    LABEL_HORIZONTAL_INSET,
                    Math.min(labelLength, charactersPerLine) * LABEL_CHARACTER_WIDTH +
                        LABEL_HORIZONTAL_INSET
                )
            ),
            height: lineCount * LABEL_LINE_HEIGHT + LABEL_VERTICAL_INSET
        }
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

    private static getBezierTangent(curve: BezierCurve, t: number): Point {
        const oneMinusT = 1 - t

        return {
            x:
                3 * oneMinusT ** 2 * (curve.sourceControl.x - curve.source.x) +
                6 * oneMinusT * t * (curve.targetControl.x - curve.sourceControl.x) +
                3 * t ** 2 * (curve.target.x - curve.targetControl.x),
            y:
                3 * oneMinusT ** 2 * (curve.sourceControl.y - curve.source.y) +
                6 * oneMinusT * t * (curve.targetControl.y - curve.sourceControl.y) +
                3 * t ** 2 * (curve.target.y - curve.targetControl.y)
        }
    }

    private static createCandidates(curve: BezierCurve): Point[] {
        const candidates: Point[] = []

        for (const factor of BASE_CANDIDATE_FACTORS) {
            const basePoint = this.getBezierPoint(curve, factor)
            const tangent = this.getBezierTangent(curve, factor)
            const tangentLength = Math.hypot(tangent.x, tangent.y)
            const normal =
                tangentLength > 0
                    ? { x: -tangent.y / tangentLength, y: tangent.x / tangentLength }
                    : { x: 0, y: 1 }

            for (const normalOffset of CANDIDATE_NORMAL_OFFSETS) {
                candidates.push({
                    x: basePoint.x + normal.x * normalOffset,
                    y: basePoint.y + normal.y * normalOffset
                })
            }
        }

        return this.uniquePoints(candidates)
    }

    private static uniquePoints(points: Point[]): Point[] {
        const keyToPoint = new Map<string, Point>()

        points.forEach((point) => {
            const key = `${Math.round(point.x * 10)}:${Math.round(point.y * 10)}`
            if (!keyToPoint.has(key)) keyToPoint.set(key, point)
        })

        return Array.from(keyToPoint.values())
    }

    private static pickBestPlacement(params: {
        candidates: Point[]
        labelEstimate: LabelEstimate
        defaultPoint: Point
        nodeObstacles: Rectangle[]
        placedLabelRectangles: Rectangle[]
    }): EdgeLabelPlacement {
        let bestPlacement: EdgeLabelPlacement | undefined

        params.candidates.forEach((candidate, index) => {
            const rectangle = this.toCenteredRectangle(candidate, params.labelEstimate)
            const nodeOverlapArea = this.getTotalOverlapArea(rectangle, params.nodeObstacles)
            const labelOverlapArea = this.getTotalOverlapArea(rectangle, params.placedLabelRectangles)
            const displacement =
                (candidate.x - params.defaultPoint.x) ** 2 + (candidate.y - params.defaultPoint.y) ** 2

            const score =
                nodeOverlapArea * NODE_OVERLAP_WEIGHT +
                labelOverlapArea * LABEL_OVERLAP_WEIGHT +
                displacement * DISPLACEMENT_WEIGHT +
                index * Number.EPSILON

            const placement: EdgeLabelPlacement = {
                point: candidate,
                score,
                rectangle
            }

            if (!bestPlacement || placement.score < bestPlacement.score) {
                bestPlacement = placement
            }
        })

        if (!bestPlacement) {
            return {
                point: params.defaultPoint,
                score: 0,
                rectangle: this.toCenteredRectangle(params.defaultPoint, params.labelEstimate)
            }
        }

        return bestPlacement
    }

    private static toCenteredRectangle(center: Point, estimate: LabelEstimate): Rectangle {
        return {
            x: center.x - estimate.width / 2,
            y: center.y - estimate.height / 2,
            width: estimate.width,
            height: estimate.height
        }
    }

    private static getTotalOverlapArea(rectangle: Rectangle, obstacles: Rectangle[]): number {
        return obstacles.reduce((area, obstacle) => area + this.getOverlapArea(rectangle, obstacle), 0)
    }

    private static getOverlapArea(left: Rectangle, right: Rectangle): number {
        const horizontalOverlap = Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x)
        const verticalOverlap = Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y)

        if (horizontalOverlap <= 0 || verticalOverlap <= 0) return 0
        return horizontalOverlap * verticalOverlap
    }
}
