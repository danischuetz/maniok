import { Direction } from "./direction.js"
import { type Relationship } from "./relationship.js"
import { type Element } from "./element.js"

export interface DiagramModel {
    id: string
    title?: string
    direction: Direction
    elements: Element[]
    relationships: Relationship[]
}
