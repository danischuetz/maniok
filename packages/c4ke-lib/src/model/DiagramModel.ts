import { Relationship } from "./relationship.js";

export interface DiagramModel {
    id: string;
    title?: string;
    description?: string;
    elements: Element[];
    relationships: Relationship[];
}
