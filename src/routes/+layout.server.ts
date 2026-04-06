import type { LayoutServerLoad } from './$types'
import { promises as fs } from 'fs'

export const load: LayoutServerLoad = async () => {
    const workspaceJson = await fs.readFile('.maniok/workspace.json', 'utf-8')

    return {
        workspaceJson
    }
}
