import Graph from 'graphology';
import noverlap from 'graphology-layout-noverlap';
import { Edge, Node } from 'react-flow-renderer';
import { compact, partition } from 'lodash';
import { GraphElements, GraphElementViewData } from './graphUtils';

const NODE_WIDTH = 175;
const NODE_HEIGHT = 70;

export type GraphElementsWithLayoutData = GraphElements<
    { position?: any; sourcePosition?: any; targetPosition?: any } & GraphElementViewData
>;

export const addGraphologyPositions = (elements: GraphElements): GraphElementsWithLayoutData => {
    const [edges, nodes] = partition(elements, (el) => (el as Edge).source);

    const emptyArr = Array(200).fill(null);
    const graphs = emptyArr.map(() => new Graph({ multi: true }));

    nodes.forEach((n) => {
        const graphNo = n.data?.networkSectionId || 0;
        if (graphNo < 0) return;
        graphs[graphNo].addNode(n.id, { node: n, x: (n as Node).position.x, y: (n as Node).position.y });
    });

    edges.forEach((e) => {
        const edge = e as Edge;
        const graphNo = e.data?.networkSectionId || 0;
        if (graphNo < 0) return;
        const g = graphs[graphNo];
        if (g.findNode((n) => n === edge.source && n === edge.target)) {
            graphs[graphNo].addEdgeWithKey(edge.id, edge.source, edge.target, edge);
        }
    });

    const layoutMappings = compact(graphs).map((g) =>
        noverlap(g, { maxIterations: 50, settings: { gridSize: 150, ratio: 0.2, margin: 40 } }),
    );
    console.log(layoutMappings);

    const positionedNodes = nodes.map((node) => {
        const graphNo = node.data?.networkSectionId || 0;
        if (graphNo < 0) return null;
        const position = layoutMappings[graphNo][node.id];

        return {
            ...node,
            position: {
                x: position.x,
                y: position.y + graphNo * 200,
            },
        };
    });
    const compactPositionedNodes = compact(positionedNodes);

    return [...compactPositionedNodes, ...edges];
};
