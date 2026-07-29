import { describe, it, expect } from 'vitest'
import { createMultiConnectionDiagram, createNestedDiagram } from './utils/testDiagrams'
import { XYFlowService } from '../src/service/xyflowservice'
import { DiagramUtils } from '../src/util/diagramutils'
import { DirectionEnum } from '../src/model/shared/direction'

describe('xyflowutils', () => {
    it('should create nodes for all elements in the diagram', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const { nodes } = XYFlowService.toNodesAndEdges(diagram)
        const flatElements = DiagramUtils.flattenElementList(diagram.elements)

        expect(nodes.length).toBe(flatElements.length)
    })

    it('should create edges for all relationships in the diagram', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const { edges } = XYFlowService.toNodesAndEdges(diagram)
        expect(edges.length).toBe(diagram.relationships.length)
    })

    it('should set edge source and target ids according to existing nodes', () => {
        const diagram = createNestedDiagram(DirectionEnum.LeftRight)

        const { nodes, edges } = XYFlowService.toNodesAndEdges(diagram)

        edges.forEach((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source)
            const targetNode = nodes.find((node) => node.id === edge.target)

            expect(sourceNode).toBeDefined()
            expect(targetNode).toBeDefined()
        })
    })

    it('should set unique edge source and taget handle ids for multiple connections', () => {
        const diagram = createMultiConnectionDiagram(DirectionEnum.LeftRight)

        const { edges } = XYFlowService.toNodesAndEdges(diagram)

        const sourceIds = edges.map((edge) => edge.sourceHandle)
        const targetIds = edges.map((edge) => edge.targetHandle)

        const uniqueSourceIds = new Set(sourceIds)
        const uniqueTargetIds = new Set(targetIds)

        expect(uniqueSourceIds.size).toBe(edges.length)
        expect(uniqueTargetIds.size).toBe(edges.length)
    })
})
