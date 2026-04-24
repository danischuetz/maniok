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
        height?: number
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

        const offset = ((index + 1) * mainDimension) / (total + 1)
        const style = `${from}: ${offset}px;`
        return style
    }
}
