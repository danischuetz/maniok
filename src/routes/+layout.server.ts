import type { LayoutServerLoad } from "./$types"
import { promises as fs } from "fs"

export const load: LayoutServerLoad = async () => {
    const workspaceJson = await fs.readFile(".c4ke/workspace.json", "utf-8")

    return {
        workspaceJson,
    }
}
