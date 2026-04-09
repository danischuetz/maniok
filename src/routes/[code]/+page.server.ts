import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { RepositoryService, type RepositoryModel } from 'maniok-core'
import { promises as fs } from 'fs'
import { env } from '$env/dynamic/private'

async function loadFromLocalFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, 'utf-8')
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
            error(
                500,
                `Workspace file not found at "${filePath}". Set the STRUCTURIZR_WORKSPACE_PATH environment variable to the correct path.`
            )
        }
        throw e
    }
}

export const load: PageServerLoad = async ({ params }) => {
    if (params.code === 'local') {
        const workspacePath = env.STRUCTURIZR_WORKSPACE_PATH ?? '.maniok/workspace.json'
        const workspaceJson = await loadFromLocalFile(workspacePath)
        return {
            repository: null,
            workspaceJson
        }
    }

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
