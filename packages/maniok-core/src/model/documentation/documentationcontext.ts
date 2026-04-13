import type { DiagramModel } from '../diagram/diagrammodel'
import type { DocumentContentModel } from './documentcontent'
import type { DocumentNodeModel } from './documentnode'

export enum ModeEnum {
    Diagrams = 'Diagrams',
    Documentation = 'Documentation'
}

export interface DocumentationContextModel {
    mode: ModeEnum
    diagrams: DiagramModel[]
    documentRoot: DocumentNodeModel | undefined
    selectedDiagram: DiagramModel | undefined
    selectedDocumentNode: DocumentNodeModel | undefined
    content: DocumentContentModel | undefined
    activeHeadingId: string | undefined
    diagramFocusId: string | undefined
}
