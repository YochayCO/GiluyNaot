import cx from 'classnames';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { CompanyNodeViewData } from '../../utils/graphUtils';
import styles from './CompanyNode.module.scss';

interface CompanyGraphNodePropsType {
    data: CompanyNodeViewData;
    isConnectable: boolean;
    id: string;
    targetPosition: Position;
    sourcePosition: Position;
}

const CompanyGraphNode = (props: CompanyGraphNodePropsType) => {
    const { data, isConnectable, id, sourcePosition, targetPosition } = props;
    const { label, isComm } = data;

    const nodeClassNames = cx(styles.node, {
        [styles.nodeComm]: isComm,
    });

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

export default CompanyGraphNode;
