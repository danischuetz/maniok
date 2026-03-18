export type { DiagramModel } from "./model/diagram/diagrammodel.js"
export type { Element } from "./model/diagram/element.js"
export type { ElementMetaData } from "./model/diagram/elementmetadata.js"
export type { Relationship } from "./model/diagram/relationship.js"
export type * from "./model/szr/szrworkspace.js"

export { ElementType } from "./model/diagram/elementtype.js"
export { Direction } from "./model/diagram/direction.js"

export { WorkspaceParser } from "./service/workspaceparser.js"
export { DiagramParser } from "./service/diagramparser.js"

export { default as Diagram } from "./components/diagram.svelte"
export { default as DiagramProvider } from "./components/diagramprovider.svelte"
