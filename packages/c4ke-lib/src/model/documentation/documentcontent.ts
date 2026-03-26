import type { HeadingModel } from './heading'

export interface DocumentContentModel {
    html: string
    headings: HeadingModel[]
}
