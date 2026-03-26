import { MarkdownService } from './markdownservice'
import type { DocumentNodeModel } from '../model/documentation/documentnode'
import type { SzrDocumentation, SzrWorkspace } from '../model/szr/szrworkspace'
import { ElementTypeEnum } from '../model/shared/elementtype'
import type { SzrElement } from '../model/szr/szrworkspace'
import type { DocumentContentModel } from '../model/documentation/documentcontent'

export class DocumentService {
    /**
     * Generates a document tree from the given workspace.
     * @param workspace The workspace to generate the document tree from.
     * @returns The root node of the generated document tree.
     */
    static generateDocumentTree(workspace: SzrWorkspace): DocumentNodeModel {
        const rootNode: DocumentNodeModel = {
            id: 'root',
            name: 'Docs',
            children: []
        }

        if (workspace.documentation)
            rootNode.documentation = this.parseDocumentation(workspace.documentation)

        workspace.model.softwareSystems?.forEach((system) => {
            const systemNode: DocumentNodeModel = this.createNodeFor(
                system,
                ElementTypeEnum.SoftwareSystem
            )
            system.containers?.forEach((container) => {
                const containerNode: DocumentNodeModel = this.createNodeFor(
                    container,
                    ElementTypeEnum.Container
                )
                container.components?.forEach((component) => {
                    const componentNode: DocumentNodeModel = this.createNodeFor(
                        component,
                        ElementTypeEnum.Component
                    )
                    if (componentNode.documentation || componentNode.children?.length)
                        containerNode.children?.push(componentNode)
                })
                if (containerNode.documentation || containerNode.children?.length)
                    systemNode.children?.push(containerNode)
            })
            if (systemNode.documentation || systemNode.children?.length)
                rootNode.children?.push(systemNode)
        })

        return rootNode
    }

    private static createNodeFor(element: SzrElement, type: ElementTypeEnum): DocumentNodeModel {
        const node: DocumentNodeModel = {
            id: element.id,
            name: element.name,
            type: type,
            children: []
        }

        if (element.documentation)
            node.documentation = this.parseDocumentation(element.documentation)
        return node
    }

    private static parseDocumentation(
        documentation: SzrDocumentation
    ): DocumentContentModel | undefined {
        if (!documentation.sections || documentation.sections.length === 0) {
            return undefined
        }

        const content = documentation.sections.map((section) => section.content).join('\n')
        return MarkdownService.parse(content)
    }
}
