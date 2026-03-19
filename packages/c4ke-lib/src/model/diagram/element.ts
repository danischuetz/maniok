import { type ElementMetaData } from './elementmetadata'

export interface Element {
    id: string
    x: number
    y: number
    width: number
    height: number
    metaData: ElementMetaData
    children: Element[]
}
