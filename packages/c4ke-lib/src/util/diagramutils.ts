import type { DiagramModel } from '../model/diagram/diagrammodel'
import { type Element } from '../model/diagram/element'

export class DiagramUtils {
    static flattenElementList(elements: Element[]): Element[] {
        let flatList: Element[] = []
        for (const element of elements) {
            flatList.push(element)
            if (element.children.length > 0) {
                flatList.push(...this.flattenElementList(element.children))
            }
        }
        return flatList
    }

    static findElementById(diagram: DiagramModel, id: string): Element | undefined {
        return this.findElementByIdRecursive(diagram.elements, id)
    }

    static findElementByIdRecursive(elements: Element[], id: string): Element | undefined {
        for (const element of elements) {
            if (element.id === id) return element

            if (element.children.length > 0) {
                const found = this.findElementByIdRecursive(element.children, id)
                if (found) return found
            }
        }
        return undefined
    }
}
