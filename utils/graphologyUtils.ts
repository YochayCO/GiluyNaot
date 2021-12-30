import Graph from 'graphology';
import noverlap from 'graphology-layout-noverlap';
import { Edge, Node } from 'react-flow-renderer';
import { partition } from 'lodash';
import { GraphElements, GraphElementViewData } from './graphUtils';

const NODE_WIDTH = 175;
const NODE_HEIGHT = 70;

export type GraphElementsWithLayoutData = GraphElements<
    { position?: any; sourcePosition?: any; targetPosition?: any } & GraphElementViewData
>;

export const addGraphologyPositions = (elements: GraphElements): GraphElementsWithLayoutData => {
    const [edges, nodes] = partition(elements, (el) => (el as Edge).source);

    const graph = new Graph({ multi: true });

    nodes.forEach((n) => {
        graph.addNode(n.id, { node: n, x: (n as Node).position.x, y: (n as Node).position.y });
    });

    edges.forEach((e) => {
        const edge = e as Edge;
        graph.addEdgeWithKey(edge.id, edge.source, edge.target, edge);
    });

    const positions = noverlap(graph, { maxIterations: 5, settings: { margin: 2000 } });

    const positionedNodes = nodes.map((node) => {
        const position = positions[node.id];

        return {
            ...node,
            position: {
                x: position.x,
                y: position.y,
            },
        };
    });

    return [...positionedNodes, ...edges];
};
