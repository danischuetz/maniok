import { describe, expect, it } from 'vitest'
import { MarkdownService } from '../src/service/markdownservice'

describe('MarkdownService', () => {
    it('should replace embed image syntax with diagram placeholders', () => {
        const content = MarkdownService.parse('![c4ke system overview](embed:CoreContainerView)')

        expect(content.html).toContain('<diagram-embed data-diagram-key="CoreContainerView"></diagram-embed>')
    })

    it('should keep normal image syntax untouched', () => {
        const content = MarkdownService.parse('![logo](https://example.com/logo.png)')

        expect(content.html).toContain('<img src="https://example.com/logo.png" alt="logo">')
    })
})
