import type { ElementType } from '../shared/elementtype'

export interface DocumentNode {
    id: string
    name: string
    type?: ElementType
    html?: string
    children?: DocumentNode[]
}
