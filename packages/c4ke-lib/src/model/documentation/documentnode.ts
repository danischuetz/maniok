import type { ElementType } from '../shared/elementtype'

export interface DocumentNode {
    name: string
    type?: ElementType
    html?: string
    children?: DocumentNode[]
}
