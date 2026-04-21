import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { RepositoryService, type RepositoryModel } from 'maniok-core'

export const load: PageServerLoad = async ({ params, depends }) => {
    const repository: RepositoryModel | null = RepositoryService.decode(params.code)
    if (!repository) {
        const errorMessage =
            'Repository not found at "' +
            RepositoryService.toUrl(repository) +
            '". Please make sure the repository exists and is accessible.'
        throw error(500, errorMessage)
    }

    let workspaceJson: string
    try {
        workspaceJson = await RepositoryService.loadResource(repository, '.maniok/workspace.json')
    } catch (e) {
        const errorMessage =
            'Workspace file not found in repository "' +
            RepositoryService.toUrl(repository) +
            '/.maniok/workspace.json". Please make sure the file exists and is accessible.'
        throw error(500, errorMessage)
    }

    return {
        repository,
        workspaceJson
    }
}
