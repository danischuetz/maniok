import { MarkdownService } from './markdownservice'
import type { DocumentNode } from '../model/documentation/documentnode'
import type { SzrDocumentation, SzrWorkspace } from '../model/szr/szrworkspace'
import { ElementType } from '../model/shared/elementtype'
import type { SzrElement } from '../model/szr/szrworkspace'

export class DocumentService {
    /**
     * Generates a document tree from the given workspace.
     * @param workspace The workspace to generate the document tree from.
     * @returns The root node of the generated document tree.
     */
    static generateDocumentTree(workspace: SzrWorkspace): DocumentNode {
        const rootNode: DocumentNode = {
            id: 'root',
            name: 'Docs',
            children: []
        }

        if (workspace.documentation)
            rootNode.html = this.parseDocumentation(workspace.documentation)

        workspace.model.softwareSystems?.forEach((system) => {
            const systemNode: DocumentNode = this.createNodeFor(system, ElementType.SoftwareSystem)
            system.containers?.forEach((container) => {
                const containerNode: DocumentNode = this.createNodeFor(
                    container,
                    ElementType.Container
                )
                container.components?.forEach((component) => {
                    const componentNode: DocumentNode = this.createNodeFor(
                        component,
                        ElementType.Component
                    )
                    if (componentNode.html || componentNode.children?.length)
                        containerNode.children?.push(componentNode)
                })
                if (containerNode.html || containerNode.children?.length)
                    systemNode.children?.push(containerNode)
            })
            if (systemNode.html || systemNode.children?.length) rootNode.children?.push(systemNode)
        })

        return rootNode
    }

    private static createNodeFor(element: SzrElement, type: ElementType): DocumentNode {
        const node: DocumentNode = {
            id: element.id,
            name: element.name,
            type: type,
            children: []
        }

        if (element.documentation) node.html = this.parseDocumentation(element.documentation)
        return node
    }

    private static parseDocumentation(documentation: SzrDocumentation): string | undefined {
        if (!documentation.sections || documentation.sections.length === 0) {
            return undefined
        }

        const content = documentation.sections.map((section) => section.content).join('\n')
        return MarkdownService.parseToHtml(content)
    }
}
