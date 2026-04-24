import { Position } from '@xyflow/svelte'
import type { ConnectionModel } from '../model/diagram/connection'

export class UIUtils {
    static getNumConnections(connections: Array<ConnectionModel>, position: Position): number {
        return connections.filter((conn) => conn.position === position).length
    }

    static getStyle(
        connection: ConnectionModel,
        connections: Array<ConnectionModel>,
        width?: number,
        height?: number,
        spread: number = 1
    ): string {
        const total = UIUtils.getNumConnections(connections, connection.position as Position)
        const index = connections
            .filter((conn) => conn.position === connection.position)
            .findIndex((conn) => conn.id === connection.id)

        const from: string =
            connection.position === Position.Top || connection.position === Position.Bottom
                ? 'left'
                : 'top'
        const mainDimension: number =
            connection.position === Position.Top || connection.position === Position.Bottom
                ? (width ?? 100)
                : (height ?? 100)

        const offset =
            ((index + 1) * mainDimension * spread) / (total + 1) +
            (mainDimension * (1 - spread)) / 2
        const style = `${from}: ${offset}px;`
        return style
    }
}
