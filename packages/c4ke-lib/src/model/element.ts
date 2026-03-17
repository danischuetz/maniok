import { ElementMetaData } from "./elementmetadata.js";

export interface Element {
    id: string;
    parentId?: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    metadata: ElementMetaData;
}
