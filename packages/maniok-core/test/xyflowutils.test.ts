import { describe, it, expect } from 'vitest'
import { createMultiConnectionDiagram, createNestedDiagram } from './utils/testDiagrams'
import { XYFlowUtils } from '../src/util/xyflowutils'
import type { Edge, Node } from '@xyflow/svelte'
import { DiagramUtils } from '../src/util/diagramutils'
import { DirectionEnum } from '../src/model/shared/direction'

describe('xyflowutils', () => {
    it('should create nodes for all elements in the diagram', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const nodes: Node[] = XYFlowUtils.toNodes(diagram.elements)
        const flatElements = DiagramUtils.flattenElementList(diagram.elements)

        expect(nodes.length).toBe(flatElements.length)
    })

    it('should create edges for all relationships in the diagram', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const nodes: Node[] = XYFlowUtils.toNodes(diagram.elements)
        const edges: Edge[] = XYFlowUtils.toEdges(nodes, diagram.relationships)
        expect(edges.length).toBe(diagram.relationships.length)
    })

    it('should set edge source and target ids according to existing nodes', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const nodes: Node[] = XYFlowUtils.toNodes(diagram.elements)
        const edges: Edge[] = XYFlowUtils.toEdges(nodes, diagram.relationships)

        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)
            const targetNode = nodes.find((node) => node.id === edge.target)

            expect(sourceNode).toBeDefined()
            expect(targetNode).toBeDefined()
        })
    })

    it('should set unique edge source and taget handle ids for multiple connections', () => {
        const diagram = createMultiConnectionDiagram(DirectionEnum.LeftRight)

        const nodes: Node[] = XYFlowUtils.toNodes(diagram.elements)
        const edges: Edge[] = XYFlowUtils.toEdges(nodes, diagram.relationships)

        const sourceIds = edges.map((edge) => edge.sourceHandle)
        const targetIds = edges.map((edge) => edge.targetHandle)

        const uniqueSourceIds = new Set(sourceIds)
        const uniqueTargetIds = new Set(targetIds)

        expect(uniqueSourceIds.size).toBe(edges.length)
        expect(uniqueTargetIds.size).toBe(edges.length)
    })
})
