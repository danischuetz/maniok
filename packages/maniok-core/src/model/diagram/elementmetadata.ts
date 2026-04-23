import { ElementTypeEnum } from '../shared/elementtype'
import type { ConnectionModel } from './connection'

export interface ElementMetaDataModel {
    title?: string
    description?: string
    technology?: string
    tags?: string
    type?: ElementTypeEnum
    external?: boolean
}
