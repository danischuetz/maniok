import { describe, it, expect } from 'vitest'
import { createNestedDiagram } from './utils/testDiagrams'
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

        const edges: Edge[] = XYFlowUtils.toEdges(diagram.relationships)
        expect(edges.length).toBe(diagram.relationships.length)
    })

    it('should set edge source and target ids according to existing nodes', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const nodes: Node[] = XYFlowUtils.toNodes(diagram.elements)
        const edges: Edge[] = XYFlowUtils.toEdges(diagram.relationships)

        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)
            const targetNode = nodes.find((node) => node.id === edge.target)

            expect(sourceNode).toBeDefined()
            expect(targetNode).toBeDefined()
        })
    })

    it('should set proper source and target positions according to the diagram direction', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const { nodes, edges } = XYFlowUtils.toNodesAndEdges(diagram)

        XYFlowUtils.setSourceAndTargetPositions(nodes, edges, diagram.direction)

        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)!
            const targetNode = nodes.find((node) => node.id === edge.target)!

            expect(sourceNode.sourcePosition).toBe('right')
            expect(targetNode.targetPosition).toBe('left')
        })
    })
})
