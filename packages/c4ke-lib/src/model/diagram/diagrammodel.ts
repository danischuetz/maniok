import { Direction } from './direction'
import { type Relationship } from './relationship'
import { type Element } from './element'

export interface DiagramModel {
    id: string
    title?: string
    direction: Direction
    elements: Element[]
    relationships: Relationship[]
}
