import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

export class MarkdownService {
    /**
     * Parses the given markdown string and returns the corresponding HTML string.
     * @param markdown The markdown string to parse.
     * @returns The HTML string generated from the markdown.
     */
    static parseToHtml(markdown: string): string {
        const processor = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: false })
            .use(rehypeSanitize)
            .use(rehypeSlug)
            .use(rehypeAutolinkHeadings, { behavior: 'append' })
            .use(rehypeStringify)

        return processor.processSync(markdown).toString()
    }
}
