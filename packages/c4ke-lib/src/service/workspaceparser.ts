import { workspaceSchema } from "../model/workspace.js";

class WorkspaceParser {
    parseWorkspaceJson(fileContent: string) {
        const workspaceJson = JSON.parse(fileContent);
        workspaceSchema.parse(workspaceJson);
    }
}

export const workspaceParser = new WorkspaceParser();
