import { get, writable, type Writable } from 'svelte/store'
import type { DiagramModel } from '../model/diagram/diagrammodel'

export const diagrams: Writable<DiagramModel[]> = writable([])
export const selectedDiagram: Writable<DiagramModel | undefined> = writable(undefined)

diagrams.subscribe((diagrams) => {
    if (diagrams.length === 0) {
        selectedDiagram.set(undefined)
    } else if (get(selectedDiagram) === undefined) {
        selectedDiagram.set(diagrams[0])
    }
})
