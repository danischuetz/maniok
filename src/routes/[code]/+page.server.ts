import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { RepositoryService, type RepositoryModel } from 'maniok-core'

export const load: PageServerLoad = async ({ params }) => {
    const repository: RepositoryModel | null = RepositoryService.decode(params.code)
    if (!repository) {
        return {
            repository: null,
            workspaceJson: ''
        }
    }

    let workspaceJson: string
    try {
        workspaceJson = await RepositoryService.loadResource(repository, '.maniok/workspace.json')
    } catch (e) {
        throw error(500, `Workspace file not found at ".maniok/workspace.json"`)
    }

    return {
        repository,
        workspaceJson
    }
}
