import { Direction } from '../shared/direction'
import { type Relationship } from './relationship'
import { type Element } from './element'
import type { DiagramType } from './diagramtype'

export interface DiagramModel {
    id: string
    title?: string
    type?: DiagramType
    direction: Direction
    elements: Element[]
    relationships: Relationship[]
}
