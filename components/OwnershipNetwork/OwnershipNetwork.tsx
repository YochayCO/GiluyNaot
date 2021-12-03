import React, { useRef, useMemo } from 'react';
import ReactFlow from 'react-flow-renderer';

import { mapEntitiesToElements } from '../../utils/graphUtils';
import { addDagreGraphPositions } from '../../utils/dagrUtils';
import { Entities } from '../../types/Entities';
import User from '../../types/User';

const OwnershipNetwork = (entities: Entities & { user: User }): any => {
    const reactFlowRef = useRef<HTMLDivElement | null>(null);

    const dagreGraphElementsMemo = useMemo(() => {
        const elements = mapEntitiesToElements(entities);
        return addDagreGraphPositions(elements);
    }, [entities]);

    return <ReactFlow ref={reactFlowRef} elements={dagreGraphElementsMemo} />;
};

export default OwnershipNetwork;
