import { type LayoutElement } from './layoutelement'
import { type LayoutEdge } from './layoutedge'
import { Direction } from '../shared/direction'

export interface LayoutModel {
    direction: Direction
    layoutElements: LayoutElement[]
    layoutEdges: LayoutEdge[]
}
