export enum ModeEnum {
    Diagrams = 'Diagrams',
    Documentation = 'Documentation'
}

export interface NavigationContextModel {
    mode: ModeEnum
    activeHeadingId: string | undefined
}
