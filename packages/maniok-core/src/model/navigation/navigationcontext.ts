import type { DiagramModel } from '../../../dist'
import type { DocumentContentModel } from '../documentation/documentcontent'
import type { DocumentNodeModel } from '../documentation/documentnode'

export enum ModeEnum {
    Diagrams = 'Diagrams',
    Documentation = 'Documentation'
}

export interface NavigationContextModel {
    mode: ModeEnum
    diagrams: DiagramModel[]
    documentRoot: DocumentNodeModel | undefined
    selectedDiagram: DiagramModel | undefined
    selectedDocumentNode: DocumentNodeModel | undefined
    content: DocumentContentModel | undefined
    activeHeadingId: string | undefined
    diagramFocusId: string | undefined
}
