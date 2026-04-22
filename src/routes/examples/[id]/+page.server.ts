import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { promises as fs } from 'fs'
import path from 'path'
import { env } from '$env/dynamic/private'

const examplesPath = env.EXAMPLES_PATH ?? path.join(process.cwd(), 'examples', 'generated')

async function loadFromLocalFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, 'utf-8')
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
            error(500, `Workspace file not found at "${filePath}".`)
        }
        throw error(500, `Error loading workspace file at "${filePath}": ${(e as Error).message}`)
    }
}

export const load: PageServerLoad = async ({ params }) => {
    const exampleId: string = params.id
    const examplePath: string = path.join(examplesPath, exampleId, 'workspace.json')
    const workspaceJson = await loadFromLocalFile(examplePath)
    return {
        repository: null,
        workspaceJson
    }
}
