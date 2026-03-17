import { DiagramModel } from "../../dist/index.js"
import { SzrWorkspace } from "../model/szr/szrworkspace.js"

class DiagramParser {
    parse(workspace: SzrWorkspace): DiagramModel[] {
        const diagrams: DiagramModel[] = []

        workspace.views?.systemContextViews?.forEach(view => {})
        workspace.views?.containerViews?.forEach(view => {})
        workspace.views?.componentViews?.forEach(view => {})

        return diagrams
    }
}
