import React, { useRef, useMemo, MouseEvent } from 'react';
import ReactFlow, { Node, getConnectedEdges } from 'react-flow-renderer';

import { mapEntitiesToElements } from '../../utils/graphUtils';
import { addGraphologyPositions } from '../../utils/graphologyUtils';
import { Entities } from '../../types/Entities';
import User from '../../types/User';

const OwnershipNetwork = (entities: Entities & { user: User }): any => {
    const reactFlowRef = useRef<HTMLDivElement | null>(null);

    const eles = useMemo(() => {
        const elements = mapEntitiesToElements(entities);
        return addGraphologyPositions(elements);
    }, [entities]);

    const onMove = (e: MouseEvent, node: Node) => {
        console.log(e, node);

        const friends = getConnectedEdges([node], []);
        console.log(friends);
    };

    return <ReactFlow ref={reactFlowRef} elements={eles} onNodeDragStop={onMove} />;
};

export default OwnershipNetwork;
