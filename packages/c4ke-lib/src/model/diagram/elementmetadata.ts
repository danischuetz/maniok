import { ElementType } from "./elementtype.js"

export interface ElementMetaData {
    title?: string
    description?: string
    technology?: string
    tags?: string[]
    type?: ElementType
}
