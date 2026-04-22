import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { promises as fs } from 'fs'
import { env } from '$env/dynamic/private'

const workspacePath = env.WORKSPACE_PATH ?? '.maniok'

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

export const load: PageServerLoad = async ({ depends }) => {
    depends('workspace:reload')
    const workspaceJson = await loadFromLocalFile(`${workspacePath}/workspace.json`)
    return {
        repository: null,
        workspaceJson
    }
}
