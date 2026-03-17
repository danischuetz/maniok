import { SzrWorkspace, workspaceSchema } from "../model/szr/szrworkspace.js"

class WorkspaceParser {
    parse(workspaceJsonFileContents: string): SzrWorkspace {
        const workspaceJson = JSON.parse(workspaceJsonFileContents)
        return workspaceSchema.parse(workspaceJson)
    }
}

export const workspaceParser = new WorkspaceParser()
