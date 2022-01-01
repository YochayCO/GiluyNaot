import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { NodeViewData } from '../../utils/graphUtils';
import styles from './PersonNode.module.scss';

interface PersonGraphNodePropsType {
    data: NodeViewData;
    isConnectable: boolean;
    id: string;
    targetPosition: Position;
    sourcePosition: Position;
}

const PersonGraphNode = (props: PersonGraphNodePropsType) => {
    const { data, isConnectable, id, sourcePosition, targetPosition } = props;
    const { label } = data;

    const nodeClassNames = styles.node;

    return (
        <>
            <Handle
                type="target"
                position={targetPosition}
                className={styles.handle}
                isConnectable={isConnectable}
                id={id}
            />
            <div className={nodeClassNames} title={label}>
                <div className={styles.label}>{label}</div>
            </div>
            <Handle
                type="source"
                position={sourcePosition}
                className={styles.handle}
                isConnectable={isConnectable}
                id={id}
            />
        </>
    );
};

export default PersonGraphNode;
