import type { ElementTypeEnum } from '../shared/elementtype'
import type { DocumentContentModel } from './documentcontent'
export interface DocumentNodeModel {
    id: string
    name: string
    type?: ElementTypeEnum
    documentation?: DocumentContentModel
    children?: DocumentNodeModel[]
}
