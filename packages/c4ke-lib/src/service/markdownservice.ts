import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

import type { DocumentContentModel } from '../model/documentation/documentcontent'
import type { HeadingModel } from '../model/documentation/heading'

function rehypeCollectHeadings() {
    return (tree: any, file: any) => {
        const headings: HeadingModel[] = []

        visit(tree, 'element', (node: any) => {
            if (!/^h[1-6]$/.test(node.tagName)) return

            headings.push({
                id: node.properties?.id ?? '',
                text:
                    node.children
                        ?.filter((child: any) => child.type === 'text')
                        .map((child: any) => child.value)
                        .join('') ?? '',
                depth: Number(node.tagName[1])
            })
        })

        file.data.headings = headings
    }
}

function rehypeEmbedImages() {
    return (tree: any) => {
        visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
            if (!parent || index === undefined || node.tagName !== 'img') return

            const src = node.properties?.src
            if (typeof src !== 'string' || !src.startsWith('embed:')) return

            const key = src.slice('embed:'.length).trim()
            parent.children[index] = {
                type: 'element',
                tagName: 'diagram-embed',
                properties: {
                    'data-diagram-key': key
                },
                children: []
            }
        })
    }
}

const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames ?? []), 'diagram-embed'],
    attributes: {
        ...(defaultSchema.attributes ?? {}),
        'diagram-embed': ['data-diagram-key']
    }
}

export class MarkdownService {
    /**
     * Parses the given markdown string and returns the corresponding HTML string.
     * @param markdown The markdown string to parse.
     * @returns The HTML string generated from the markdown.
     */
    static parse(markdown: string): DocumentContentModel {
        const processor = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: false })
            .use(rehypeEmbedImages)
            .use(rehypeSanitize, sanitizeSchema)
            .use(rehypeSlug)
            .use(rehypeAutolinkHeadings, { behavior: 'append' })
            .use(rehypeCollectHeadings)
            .use(rehypeStringify)

        const file = processor.processSync(markdown)

        return {
            html: file.toString(),
            headings: (file.data.headings as HeadingModel[]) ?? []
        }
    }
}
