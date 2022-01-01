import React, { useRef, MouseEvent, useState, useMemo } from 'react';
import ReactFlow, { Node } from 'react-flow-renderer';

import PersonNode from '../PersonNode/PersonNode';
import { mapEntitiesToElements } from '../../utils/graphUtils';
import { Entities } from '../../types/Entities';
import User from '../../types/User';
import CompanyNode from '../CompanyNode/CompanyNode';

const RADIUS = 150;
const WIDTH = 50;

const nodeTypes = {
    person: PersonNode,
    company: CompanyNode,
};

const OwnershipNetwork = (entities: Entities & { user: User }): any => {
    const initialEles = mapEntitiesToElements(entities);
    const reactFlowRef = useRef<HTMLDivElement | null>(null);
    const [nodes, setNodes] = useState(initialEles.nodes);
    const [edges] = useState(initialEles.edges);

    const eles = useMemo(() => [...nodes, ...edges], [nodes, edges]);

    const onSuperMove = (e: MouseEvent, node: Node) => {
        const edgeFriends = edges.filter((edge) => edge.source === node.id || edge.target === node.id);
        const nodeFriends = nodes.filter(
            (n) => n.id !== node.id && edgeFriends.find((edge) => edge.source === n.id || edge.target === n.id),
        );
        // const height = 20;
        const newNodeFriends = nodeFriends.map((n, i) => {
            const angle = (i / (nodeFriends.length / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
            // For a semicircle, we would use (i / numNodes) * Math.PI.
            const x = RADIUS * Math.cos(angle) + WIDTH / 2 + node.position.x; // Calculate the x position of the element.
            const y = RADIUS * Math.sin(angle) + WIDTH / 2 + node.position.y; // Calculate the y position of the element.

            return {
                ...n,
                position: { x, y },
            };
        });

        setNodes(nodes.map((n) => newNodeFriends.find((nf) => nf.id === n.id) || n));
    };

    return <ReactFlow ref={reactFlowRef} elements={eles} onNodeDoubleClick={onSuperMove} nodeTypes={nodeTypes} />;
};

export default OwnershipNetwork;
