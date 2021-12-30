import dagre from 'dagre';
import { flatten, groupBy, map } from 'lodash';
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

export const layoutGraph = (elements: GraphElements): GraphElementsWithLayoutData => {
    const safeElements = elements.filter((element) => Number.isFinite(element.data?.networkSectionId));
    const sectionedElements = groupBy(safeElements, (element) => element.data!.networkSectionId);
    const sectionedElementsArr = Object.entries(sectionedElements).reduce((currArr, currEles) => {
        const networkSecId = Number(currEles[0]);
        if (!Number.isFinite(networkSecId)) return currArr;
        const newArr = [...currArr];
        // eslint-disable-next-line prefer-destructuring
        newArr[networkSecId] = currEles[1];
        return newArr;
    }, new Array(sectionedElements.length));

    const safeSectionedElementsArr = sectionedElementsArr.filter((eles) => !!eles);

    const positionedSectionedElements = map(safeSectionedElementsArr, (eles, index) => {
        console.log(eles, index);
        const positionedElements = addDagreGraphPositions(eles);
        return positionedElements.map((element) => {
            if (!isNode(element)) return element;

            return {
                ...element,
                position: { x: element.data?.position?.x, y: element.data?.position?.y + Number(index) * 100 },
            };
        });
    });

    console.log(flatten(positionedSectionedElements));

    return flatten(positionedSectionedElements);
};

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
