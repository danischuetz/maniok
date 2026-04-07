import { type LayoutElementModel } from './layoutelement'
import { type LayoutEdgeModel } from './layoutedge'
import { DirectionEnum } from '../shared/direction'

export interface LayoutModel {
    direction: DirectionEnum
    layoutElements: LayoutElementModel[]
    layoutEdges: LayoutEdgeModel[]
}
