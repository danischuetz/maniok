import { SzrWorkspace, workspaceSchema } from "../model/szr/szrworkspace.js"

export class WorkspaceParser {
    static parse(workspaceJsonFileContents: string): SzrWorkspace {
        const workspaceJson = JSON.parse(workspaceJsonFileContents)
        return workspaceSchema.parse(workspaceJson)
    }
}
