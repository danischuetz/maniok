import { ElementTypeEnum } from '../shared/elementtype'

export interface ElementMetaDataModel {
    title?: string
    description?: string
    technology?: string
    tags?: string
    type?: ElementTypeEnum
}
