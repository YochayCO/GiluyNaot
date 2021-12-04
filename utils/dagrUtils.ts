import dagre from 'dagre';
import { isNode, Position } from 'react-flow-renderer';
import { GraphElements, GraphElementViewData } from './graphUtils';

const NODE_WIDTH = 175;
const NODE_HEIGHT = 70;

function createTopBottomTreeGraph() {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });
    return dagreGraph;
}

export type GraphElementsWithLayoutData = GraphElements<
    { position?: any; sourcePosition?: any; targetPosition?: any } & GraphElementViewData
>;

export const addDagreGraphPositions = (elements: GraphElements): GraphElementsWithLayoutData => {
    const dagreGraph = createTopBottomTreeGraph();

    elements.forEach((el) => {
        if (isNode(el)) {
            dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
        } else {
            dagreGraph.setEdge(el.source, el.target);
        }
    });

    dagre.layout(dagreGraph);

    return elements.map((el) => {
        if (isNode(el)) {
            const nodeWithPosition = dagreGraph.node(el.id);
            return {
                ...el,
                targetPosition: Position.Top,
                sourcePosition: Position.Bottom,
                position: {
                    x: nodeWithPosition.x - NODE_WIDTH / 2,
                    y: nodeWithPosition.y - NODE_HEIGHT / 2,
                },
            };
        }

        return el;
    });
};
