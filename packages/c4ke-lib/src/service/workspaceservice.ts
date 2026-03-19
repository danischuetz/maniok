import { type SzrWorkspace, workspaceSchema } from '../model/szr/szrworkspace'

export class WorkspaceService {
    static parse(workspaceJsonFileContents: string): SzrWorkspace {
        const workspaceJson = JSON.parse(workspaceJsonFileContents)
        return workspaceSchema.parse(workspaceJson)
    }
}
