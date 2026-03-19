import { type ElementMetaData } from './elementmetadata'

export interface Element {
    id: string
    metaData: ElementMetaData
    children: Element[]
}
