import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { RepositoryService, type RepositoryModel } from 'maniok-core'
import { promises as fs } from 'fs'
import { env } from '$env/dynamic/private'
import { Watcher } from 'maniok-exporter'

const workspacePath = env.WORKSPACE_PATH ?? '.maniok'

const watcher: Watcher = new Watcher()

async function loadFromLocalFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, 'utf-8')
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
            error(
                500,
                `Workspace file not found at "${filePath}". Set the WORKSPACE_PATH environment variable to the correct path.`
            )
        }
        throw e
    }
}

export const load: PageServerLoad = async ({ params, depends }) => {
    depends('workspace:reload')

    if (params.code === 'local') {
        const workspaceJson = await loadFromLocalFile(`${workspacePath}/workspace.json`)
        return {
            repository: null,
            workspaceJson
        }
    }

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
