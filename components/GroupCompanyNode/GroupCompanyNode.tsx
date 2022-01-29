import cx from 'classnames';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { CompanyNodeViewData } from '../../utils/graphUtils';
import styles from './GroupCompanyNode.module.scss';

interface GroupCompanyGraphNodePropsType {
    data: CompanyNodeViewData;
    isConnectable: boolean;
    id: string;
}

const CompanyGraphNode = (props: GroupCompanyGraphNodePropsType) => {
    const { data, isConnectable, id } = props;
    const { label, isComm } = data;
    const targetPosition = Position.Top;
    const sourcePosition = Position.Bottom;

    const nodeClassNames = cx(styles.node, {
        [styles['node--comm']]: isComm,
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
            <div className={nodeClassNames} title={label} style={{ width: 500, height: 500 }}>
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
