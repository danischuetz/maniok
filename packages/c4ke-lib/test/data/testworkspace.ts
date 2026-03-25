import type { SzrWorkspace } from '../../src/model/szr/szrworkspace'

export const testWorkspace: SzrWorkspace = {
    configuration: {},
    description: 'Description',
    id: 1,
    lastModifiedDate: '2026-03-18T11:02:27Z',
    model: {
        people: [
            {
                id: '1',
                name: 'Viewer',
                properties: {
                    'structurizr.dsl.identifier': 'editor'
                },
                relationships: [
                    {
                        description: 'inspect and navigate documentation',
                        destinationId: '4',
                        id: '23',
                        sourceId: '1',
                        tags: 'Relationship'
                    },
                    {
                        description: 'inspect and navigate documentation',
                        destinationId: '3',
                        id: '24',
                        linkedRelationshipId: '23',
                        sourceId: '1'
                    }
                ],
                tags: 'Element,Person'
            },
            {
                id: '2',
                name: 'Editor',
                properties: {
                    'structurizr.dsl.identifier': 'editor'
                },
                relationships: [
                    {
                        description: 'check syntax',
                        destinationId: '19',
                        id: '25',
                        sourceId: '2',
                        tags: 'Relationship'
                    },
                    {
                        description: 'check syntax',
                        destinationId: '17',
                        id: '26',
                        linkedRelationshipId: '25',
                        sourceId: '2'
                    },
                    {
                        description: 'inspect rendered version',
                        destinationId: '16',
                        id: '27',
                        sourceId: '2',
                        tags: 'Relationship'
                    },
                    {
                        description: 'inspect rendered version',
                        destinationId: '3',
                        id: '28',
                        linkedRelationshipId: '27',
                        sourceId: '2'
                    },
                    {
                        description: 'push changes',
                        destinationId: '22',
                        id: '29',
                        sourceId: '2',
                        tags: 'Relationship'
                    },
                    {
                        description: 'push changes',
                        destinationId: '20',
                        id: '30',
                        linkedRelationshipId: '29',
                        sourceId: '2'
                    }
                ],
                tags: 'Element,Person'
            }
        ],
        softwareSystems: [
            {
                containers: [
                    {
                        description:
                            'A web application for consumers of technical software documentation written using the Structurizr DSL',
                        id: '4',
                        name: 'c4ke-webapp',
                        properties: {
                            'structurizr.dsl.identifier': 'c4ke-webapp'
                        },
                        relationships: [
                            {
                                description:
                                    'retrieve .c4ke/workspace.json from client repo at given URL',
                                destinationId: '21',
                                id: '31',
                                sourceId: '4',
                                tags: 'Relationship'
                            },
                            {
                                description:
                                    'retrieve .c4ke/workspace.json from client repo at given URL',
                                destinationId: '20',
                                id: '32',
                                linkedRelationshipId: '31',
                                sourceId: '4'
                            },
                            {
                                description:
                                    'Use logic & components to present workspace diagrams & documents',
                                destinationId: '8',
                                id: '35',
                                sourceId: '4',
                                tags: 'Relationship'
                            },
                            {
                                description:
                                    'Use logic & components to present workspace diagrams & documents',
                                destinationId: '7',
                                id: '36',
                                linkedRelationshipId: '35',
                                sourceId: '4'
                            }
                        ],
                        tags: 'Element,Container',
                        technology: 'SvelteKit'
                    },
                    {
                        components: [
                            {
                                description:
                                    'Packages a java runtime with java code to make it usable as a node module',

                                id: '6',
                                name: 'Java Wrapper',
                                properties: {
                                    'structurizr.dsl.identifier': 'java-wrapper'
                                },
                                tags: 'Element,Component',
                                technology: 'node.js'
                            }
                        ],
                        description: 'Exports structurizr documentation to a workspace.json object',

                        id: '5',
                        name: 'dsl-exporter',
                        properties: {
                            'structurizr.dsl.identifier': 'c4ke-dsl-exporter'
                        },
                        tags: 'Element,Container',
                        technology: 'node.js'
                    },
                    {
                        components: [
                            {
                                id: '8',
                                name: 'API',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-api'
                                },
                                relationships: [
                                    {
                                        description: 'expose component',
                                        destinationId: '9',
                                        id: '39',
                                        sourceId: '8',
                                        tags: 'Relationship'
                                    },
                                    {
                                        description: 'expose parser',
                                        destinationId: '10',
                                        id: '40',
                                        sourceId: '8',
                                        tags: 'Relationship'
                                    },
                                    {
                                        description: 'expose component',
                                        destinationId: '11',
                                        id: '41',
                                        sourceId: '8',
                                        tags: 'Relationship'
                                    },
                                    {
                                        description: 'expose component',
                                        destinationId: '13',
                                        id: '42',
                                        sourceId: '8',
                                        tags: 'Relationship'
                                    },
                                    {
                                        description: 'expose parser',
                                        destinationId: '14',
                                        id: '43',
                                        sourceId: '8',
                                        tags: 'Relationship'
                                    },
                                    {
                                        description: 'expose component',
                                        destinationId: '15',
                                        id: '44',
                                        sourceId: '8',
                                        tags: 'Relationship'
                                    }
                                ],
                                tags: 'Element,Component'
                            },
                            {
                                description: 'Renders diagrams',

                                id: '9',
                                name: 'Diagram',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-diagram'
                                },
                                relationships: [
                                    {
                                        description: 'calculate layout',
                                        destinationId: '12',
                                        id: '45',
                                        sourceId: '9',
                                        tags: 'Relationship'
                                    }
                                ],
                                tags: 'Element,Component'
                            },
                            {
                                description: 'Creates array of diagrams from workspace object',

                                id: '10',
                                name: 'Diagram Parser',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-diagramparser'
                                },
                                tags: 'Element,Component'
                            },
                            {
                                description: 'Allows users to navigate diagrams',

                                id: '11',
                                name: 'Diagram Navigation',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-diagramnavigation'
                                },
                                tags: 'Element,Component'
                            },
                            {
                                description:
                                    'Calculates the layout of diagram elements according to the contents and relationships',

                                id: '12',
                                name: 'Layout Engine',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-layoutEngine'
                                },
                                tags: 'Element,Component'
                            },
                            {
                                description: 'Renders documentation written in Markdown',

                                id: '13',
                                name: 'Document',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-document'
                                },
                                tags: 'Element,Component'
                            },
                            {
                                description: 'Creates array of diagrams from workspace object',

                                id: '14',
                                name: 'Workspace Parser',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-documentparser'
                                },
                                tags: 'Element,Component'
                            },
                            {
                                description: 'Allows users to navigate written documentation',

                                id: '15',
                                name: 'Document Navigation',
                                properties: {
                                    'structurizr.dsl.identifier': 'c4ke-lib-documentnavigation'
                                },
                                tags: 'Element,Component'
                            }
                        ],
                        description:
                            'Core logic and components to view and navigate documentation described by a Structurizr workspace object',

                        id: '7',
                        name: 'c4ke-lib',
                        properties: {
                            'structurizr.dsl.identifier': 'c4ke-lib'
                        },
                        tags: 'Element,Container',
                        technology: 'node.js'
                    },
                    {
                        description:
                            'VSCode Extension. Renders the documentation into a webview as it would be presented in the webapp',

                        id: '16',
                        name: 'c4ke-preview',
                        properties: {
                            'structurizr.dsl.identifier': 'c4ke-preview'
                        },
                        relationships: [
                            {
                                description:
                                    'Use logic & components to present workspace diagrams & documents',
                                destinationId: '8',
                                id: '37',
                                sourceId: '16',
                                tags: 'Relationship'
                            },
                            {
                                description:
                                    'Use logic & components to present workspace diagrams & documents',
                                destinationId: '7',
                                id: '38',
                                linkedRelationshipId: '37',
                                sourceId: '16'
                            }
                        ],
                        tags: 'Element,Container',
                        technology: 'node.js'
                    }
                ],
                description:
                    'A software system to minimize friction when creating, maintaining and consuming technical software documentation',
                id: '3',
                name: 'c4ke',
                properties: {
                    'structurizr.dsl.identifier': 'c4ke'
                },
                relationships: [
                    {
                        description: 'retrieve .c4ke/workspace.json from client repo at given URL',
                        destinationId: '21',
                        id: '33',
                        linkedRelationshipId: '31',
                        sourceId: '3'
                    },
                    {
                        description: 'retrieve .c4ke/workspace.json from client repo at given URL',
                        destinationId: '20',
                        id: '34',
                        linkedRelationshipId: '31',
                        sourceId: '3'
                    }
                ],
                tags: 'Element,Software System'
            },
            {
                containers: [
                    {
                        description: 'Exports documentation to workspace.json object',

                        id: '18',
                        name: 'Structurizr Export',
                        properties: {
                            'structurizr.dsl.identifier': 'structurizr-export'
                        },
                        tags: 'Element,Container',
                        technology: 'Java'
                    },
                    {
                        description:
                            'VSCode Extension. Provides syntax highlighting for the Structurizr DSL',

                        id: '19',
                        name: 'Structurizr Extension',
                        properties: {
                            'structurizr.dsl.identifier': 'structurizrExtension'
                        },
                        tags: 'Element,Container',
                        technology: 'node.js'
                    }
                ],
                description:
                    'Defines the Structurizr DSL and parses structurizr documentation to workspace objects',

                id: '17',
                name: 'Structurizr',
                properties: {
                    'structurizr.dsl.identifier': 'structurizr'
                },
                tags: 'Element,Software System,Java'
            },
            {
                containers: [
                    {
                        id: '21',
                        name: 'GitHub API',
                        properties: {
                            'structurizr.dsl.identifier': 'github-api'
                        },
                        relationships: [
                            {
                                description: 'retrieve .c4ke/workspace.json',
                                destinationId: '22',
                                id: '46',
                                sourceId: '21',
                                tags: 'Relationship'
                            }
                        ],
                        tags: 'Element,Container'
                    },
                    {
                        description: 'Contains a .c4ke documentation directory',

                        id: '22',
                        name: 'Client Repository',
                        properties: {
                            'structurizr.dsl.identifier': 'github-client-repo'
                        },
                        tags: 'Element,Container',
                        technology: 'GitHub Repo'
                    }
                ],

                id: '20',
                name: 'GitHub',
                properties: {
                    'structurizr.dsl.identifier': 'github'
                },
                tags: 'Element,Software System'
            }
        ]
    },
    name: 'Name',
    properties: {
        'structurizr.inspection.error': '49',
        'structurizr.inspection.info': '0',
        'structurizr.inspection.ignore': '0',
        'structurizr.inspection.warning': '0'
    },
    views: {
        componentViews: [
            {
                automaticLayout: {
                    edgeSeparation: 50,
                    nodeSeparation: 50,
                    rankDirection: 'LeftRight',
                    rankSeparation: 100,
                    vertices: true
                },
                containerId: '7',
                elements: [
                    {
                        id: '4',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '8',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '9',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '10',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '11',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '12',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '13',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '14',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '15',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '16',
                        x: 0,
                        y: 0
                    }
                ],
                externalContainerBoundariesVisible: false,
                generatedKey: true,
                key: 'Component-001',
                name: 'Component View: c4ke - c4ke-lib',
                order: 5,
                relationships: [
                    {
                        id: '35'
                    },
                    {
                        id: '37'
                    },
                    {
                        id: '39'
                    },
                    {
                        id: '40'
                    },
                    {
                        id: '41'
                    },
                    {
                        id: '42'
                    },
                    {
                        id: '43'
                    },
                    {
                        id: '44'
                    },
                    {
                        id: '45'
                    }
                ]
            },
            {
                automaticLayout: {
                    edgeSeparation: 50,
                    nodeSeparation: 50,
                    rankDirection: 'LeftRight',
                    rankSeparation: 100,
                    vertices: true
                },
                containerId: '5',
                elements: [
                    {
                        id: '6',
                        x: 0,
                        y: 0
                    }
                ],
                externalContainerBoundariesVisible: false,
                generatedKey: true,
                key: 'Component-002',
                name: 'Component View: c4ke - dsl-exporter',
                order: 6
            }
        ],
        configuration: {
            styles: {},
            terminology: {}
        },
        containerViews: [
            {
                automaticLayout: {
                    edgeSeparation: 50,
                    nodeSeparation: 50,
                    rankDirection: 'LeftRight',
                    rankSeparation: 100,
                    vertices: true
                },
                elements: [
                    {
                        id: '1',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '2',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '4',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '5',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '7',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '16',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '20',
                        x: 0,
                        y: 0
                    }
                ],
                externalSoftwareSystemBoundariesVisible: false,
                generatedKey: true,
                key: 'Container-001',
                name: 'Container View: c4ke',
                order: 2,
                relationships: [
                    {
                        id: '23'
                    },
                    {
                        id: '27'
                    },
                    {
                        id: '30'
                    },
                    {
                        id: '32'
                    },
                    {
                        id: '36'
                    },
                    {
                        id: '38'
                    }
                ],
                softwareSystemId: '3'
            },
            {
                automaticLayout: {
                    edgeSeparation: 50,
                    nodeSeparation: 50,
                    rankDirection: 'LeftRight',
                    rankSeparation: 100,
                    vertices: true
                },
                elements: [
                    {
                        id: '2',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '3',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '21',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '22',
                        x: 0,
                        y: 0
                    }
                ],
                externalSoftwareSystemBoundariesVisible: false,
                generatedKey: true,
                key: 'Container-002',
                name: 'Container View: GitHub',
                order: 3,
                relationships: [
                    {
                        id: '28'
                    },
                    {
                        id: '29'
                    },
                    {
                        id: '33'
                    },
                    {
                        id: '46'
                    }
                ],
                softwareSystemId: '20'
            },
            {
                automaticLayout: {
                    edgeSeparation: 50,
                    nodeSeparation: 50,
                    rankDirection: 'LeftRight',
                    rankSeparation: 100,
                    vertices: true
                },
                elements: [
                    {
                        id: '2',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '18',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '19',
                        x: 0,
                        y: 0
                    }
                ],
                externalSoftwareSystemBoundariesVisible: false,
                generatedKey: true,
                key: 'Container-003',
                name: 'Container View: Structurizr',
                order: 4,
                relationships: [
                    {
                        id: '25'
                    }
                ],
                softwareSystemId: '17'
            }
        ],
        systemContextViews: [
            {
                automaticLayout: {
                    edgeSeparation: 50,
                    nodeSeparation: 50,
                    rankDirection: 'LeftRight',
                    rankSeparation: 100,
                    vertices: true
                },
                elements: [
                    {
                        id: '1',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '2',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '3',
                        x: 0,
                        y: 0
                    },
                    {
                        id: '20',
                        x: 0,
                        y: 0
                    }
                ],
                enterpriseBoundaryVisible: true,
                generatedKey: true,
                key: 'SystemContext-001',
                name: 'System Context View: c4ke',
                order: 1,
                relationships: [
                    {
                        id: '24'
                    },
                    {
                        id: '28'
                    },
                    {
                        id: '30'
                    },
                    {
                        id: '34'
                    }
                ],
                softwareSystemId: '3'
            }
        ]
    }
}
