import { MarkdownService } from '../../dist'
import type { DocumentNode } from '../model/documentation/documentnode'
import type { SzrWorkspace } from '../model/szr/szrworkspace'

export class DocumentService {
    /**
     * Generates a document tree from the given workspace.
     * @param workspace The workspace to generate the document tree from.
     * @returns The root node of the generated document tree.
     */
    static generateDocumentTree(workspace: SzrWorkspace): DocumentNode {
        const rootNode: DocumentNode = {
            name: 'Root',
            children: []
        }

        if (
            workspace.documentation &&
            workspace.documentation.sections &&
            workspace.documentation.sections.length > 0
        ) {
            const content = workspace.documentation.sections
                .map((section) => section.content)
                .join('\n')
            rootNode.html = MarkdownService.parseToHtml(content)
        }

        return rootNode
    }
}
