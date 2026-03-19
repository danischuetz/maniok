import { Direction } from './direction'
import { type Relationship } from './relationship'
import { type Element } from './element'
import { DiagramType } from './diagramtype'

export interface DiagramModel {
    id: string
    type: DiagramType
    title?: string
    direction: Direction
    elements: Element[]
    relationships: Relationship[]
}
