export type { DiagramModel } from './model/diagram/diagrammodel'
export type { Element } from './model/diagram/element'
export type { ElementMetaData } from './model/diagram/elementmetadata'
export type { Relationship } from './model/diagram/relationship'
export type * from './model/szr/szrworkspace'

export { ElementType } from './model/diagram/elementtype'
export { Direction } from './model/shared/direction'

export { WorkspaceService } from './service/workspaceservice'
export { DiagramService } from './service/diagramservice'

export { default as Diagram } from './components/diagram.svelte'
export { default as DiagramProvider } from './components/diagramprovider.svelte'
