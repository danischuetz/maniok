import { describe, it, expect, beforeAll } from 'vitest'
import { testWorkspace } from './data/testworkspace'
import type { DocumentNode } from '../src/model/documentation/documentnode'
import { DocumentService } from '../src/service/documentservice'
import type { SzrWorkspace } from '../src'

const testSection: any = {
    content: '# Heading 1\n\nSome content.\n',
    format: 'Markdown',
    order: 1,
    title: ''
}

describe('root node', () => {
    let workspace: SzrWorkspace = testWorkspace

    beforeAll(() => {
        // expect workspace to not contain any sections of documentation
        expect(workspace.documentation).toBeUndefined()
        workspace.model.softwareSystems?.forEach((system) => {
            expect(system.documentation).toBeUndefined()
            system.containers?.forEach((container) => {
                expect(container.documentation).toBeUndefined()
                container.components?.forEach((component) => {
                    expect(component.documentation).toBeUndefined()
                })
            })
        })
    })

    it('should exist even without any documentation', () => {
        const root: DocumentNode = DocumentService.generateDocumentTree(testWorkspace)
        expect(root).toBeDefined()
    })

    it('should contain parsed html once documentation is added to the workspace', () => {
        workspace.documentation = {
            sections: [testSection]
        }

        const root: DocumentNode = DocumentService.generateDocumentTree(workspace)
        expect(root.html).toBeDefined()
        expect(root.html).toContain('Heading 1')
    })

    it('should contain all documentable children of the workspace regardless of whether they have documentation or not', () => {
        workspace.model.softwareSystems![0].containers![1].components![0].documentation = {
            sections: [testSection]
        }

        const root: DocumentNode = DocumentService.generateDocumentTree(workspace)

        expect(root.children).toBeDefined()
        expect(root.children?.length).toBe(1)

        expect(root.children![0].children).toBeDefined()
        expect(root.children![0].children?.length).toBe(1)
    })
})
