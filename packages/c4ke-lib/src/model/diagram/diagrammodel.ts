import { Direction } from "./direction.js"
import { Relationship } from "./relationship.js"

export interface DiagramModel {
    id: string
    title?: string
    description?: string
    direction: Direction
    elements: Element[]
    relationships: Relationship[]
}
