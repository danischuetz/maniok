import type { DiagramModel } from '../model/diagram/diagrammodel'
import { type ElementModel } from '../model/diagram/element'

export class DiagramUtils {
    static flattenElementList(elements: ElementModel[]): ElementModel[] {
        let flatList: ElementModel[] = []
        for (const element of elements) {
            flatList.push(element)
            if (element.children.length > 0) {
                flatList.push(...this.flattenElementList(element.children))
            }
        }
        return flatList
    }

    static findElementById(diagram: DiagramModel, id: string): ElementModel | undefined {
        return this.findElementByIdRecursive(diagram.elements, id)
    }

    static findElementByIdRecursive(
        elements: ElementModel[],
        id: string
    ): ElementModel | undefined {
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
