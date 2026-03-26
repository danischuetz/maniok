import { DirectionEnum } from '../shared/direction'
import { type RelationshipModel } from './relationship'
import { type ElementModel } from './element'
import type { DiagramTypeModel } from './diagramtype'

export interface DiagramModel {
    id: string
    title?: string
    type?: DiagramTypeModel
    direction: DirectionEnum
    elements: ElementModel[]
    relationships: RelationshipModel[]
}
