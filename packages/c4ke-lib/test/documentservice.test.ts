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
        const root: DocumentNode = DocumentService.generateDocumentTree(workspace)

        const numSoftwareSystems = workspace.model.softwareSystems?.length || 0
        expect(root.children).toBeDefined()
        expect(root.children?.length).toBe(numSoftwareSystems)

        workspace.model.softwareSystems?.forEach((system, systemIndex) => {
            const numContainers = system.containers?.length || 0
            expect(root.children?.[systemIndex].children).toBeDefined()
            expect(root.children?.[systemIndex].children?.length).toBe(numContainers)

            system.containers?.forEach((container, containerIndex) => {
                const numComponents = container.components?.length || 0
                expect(
                    root.children?.[systemIndex].children?.[containerIndex].children
                ).toBeDefined()
                expect(
                    root.children?.[systemIndex].children?.[containerIndex].children?.length
                ).toBe(numComponents)
            })
        })
    })
})
