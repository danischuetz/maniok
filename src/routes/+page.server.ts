import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { promises as fs } from 'fs'
import { env } from '$env/dynamic/private'

export const load: PageServerLoad = async () => {
    const workspacePath = env.STRUCTURIZR_WORKSPACE_PATH ?? '.maniok/workspace.json'
    let workspaceJson: string
    try {
        workspaceJson = await fs.readFile(workspacePath, 'utf-8')
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
            error(
                500,
                `Workspace file not found at "${workspacePath}". Set the STRUCTURIZR_WORKSPACE_PATH environment variable to the correct path.`
            )
        }
        throw e
    }
    return {
        workspaceJson
    }
}
