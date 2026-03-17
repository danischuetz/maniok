import { z } from "zod"

const relationshipSchema = z.object({
    id: z.string(),
    tags: z.string().optional(),
    sourceId: z.string(),
    destinationId: z.string(),
    description: z.string().optional(),
})

const elementSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    technology: z.string().optional(),
    relationships: z.array(relationshipSchema).optional(),
    tags: z.string().optional(),
})

const personSchema = elementSchema
const componentSchema = elementSchema

const containerSchema = elementSchema.extend({
    components: z.array(componentSchema).optional(),
})

const softwareSystemSchema = elementSchema.extend({
    containers: z.array(containerSchema).optional(),
})

const viewElementSchema = z.object({
    id: z.string(),
})

const viewRelationshipSchema = z.object({
    id: z.string(),
})

const automaticLayoutSchema = z.object({
    rankDirection: z.enum(["TopBottom", "LeftRight", "BottomTop", "RightLeft"]),
})

const viewBaseSchema = z.object({
    key: z.string(),
    name: z.string(),
    order: z.number().int(),
    elements: z.array(viewElementSchema).optional(),
    relationships: z.array(viewRelationshipSchema).optional(),
    automaticLayout: automaticLayoutSchema.optional(),
})

const systemContextViewSchema = viewBaseSchema.extend({
    softwareSystemId: z.string(),
})

const containerViewSchema = viewBaseSchema.extend({
    softwareSystemId: z.string(),
})

const componentViewSchema = viewBaseSchema.extend({
    containerId: z.string(),
})

const modelSchema = z.object({
    people: z.array(personSchema).optional(),
    softwareSystems: z.array(softwareSystemSchema).optional(),
})

export const workspaceSchema = z.object({
    id: z.number().int(),
    name: z.string().optional(),
    description: z.string().optional(),
    lastModifiedDate: z.string().optional(),
    model: modelSchema,
    views: z
        .object({
            systemContextViews: z.array(systemContextViewSchema).optional(),
            containerViews: z.array(containerViewSchema).optional(),
            componentViews: z.array(componentViewSchema).optional(),
        })
        .optional(),
})

export type SzrElement = z.infer<typeof elementSchema>
export type SzrRelationship = z.infer<typeof relationshipSchema>
export type SzrPerson = z.infer<typeof personSchema>
export type SzrComponent = z.infer<typeof componentSchema>
export type SzrContainer = z.infer<typeof containerSchema>
export type SzrSoftwareSystem = z.infer<typeof softwareSystemSchema>
export type SzrViewElement = z.infer<typeof viewElementSchema>
export type SzrViewRelationship = z.infer<typeof viewRelationshipSchema>
export type SzrAutomaticLayout = z.infer<typeof automaticLayoutSchema>
export type SzrView = z.infer<typeof viewBaseSchema>
export type SzrSystemContextView = z.infer<typeof systemContextViewSchema>
export type SzrContainerView = z.infer<typeof containerViewSchema>
export type SzrComponentView = z.infer<typeof componentViewSchema>
export type SzrModel = z.infer<typeof modelSchema>
export type SzrWorkspace = z.infer<typeof workspaceSchema>
