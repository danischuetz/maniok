import { Direction } from "./direction.js"
import { Relationship } from "./relationship.js"
import { Element } from "./element.js"

export interface DiagramModel {
    id: string
    title?: string
    direction: Direction
    elements: Element[]
    relationships: Relationship[]
}
