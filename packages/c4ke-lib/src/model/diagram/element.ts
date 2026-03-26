import { type ElementMetaDataModel } from './elementmetadata'

export interface ElementModel {
    id: string
    metaData: ElementMetaDataModel
    children: ElementModel[]
}
