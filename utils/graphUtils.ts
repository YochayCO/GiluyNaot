import { Edge, Elements, Node } from 'react-flow-renderer';

import Company from '../types/Company';
import { CompanyOwnership, OwnershipLevel } from '../types/Ownerships';
import { Entities } from '../types/Entities';

const INITIAL_NODE_POSITION = { x: 0, y: 0 };

export interface CompanyNodeViewData {
    originalId: string;
    label: string;
}

export interface CompanyOwnershipEdgeData {
    originalId: string;
    level: OwnershipLevel;
}

export type GraphElementViewData = CompanyNodeViewData | CompanyOwnershipEdgeData;
export type GraphElements<T = GraphElementViewData> = Elements<T>;

export const createCompanyElement = (company: Company): Node<CompanyNodeViewData> => {
    const { id, name } = company;

    return {
        id: `company_${id}`,
        // type: 'company',
        data: {
            originalId: id,
            label: name,
        },
        position: INITIAL_NODE_POSITION,
    };
};

export const mapEntitiesToElements = ({ companies, companyOwnerships, ownerships, relationships }: Entities) => {
    if (!companies || !companyOwnerships) throw new Error('Some error with entities');
    const companyElements = companies.map(createCompanyElement);
    const companyOwnershipEdges = companyOwnerships
        .filter((c) => c.subsidiary && c.parent)
        .map(createCompanyOwnershipEdge);
    return [...companyElements, ...companyOwnershipEdges];
};

export const createCompanyOwnershipEdge = (companyOwnership: CompanyOwnership): Edge<CompanyOwnershipEdgeData> => {
    const { id, parent, subsidiary, level } = companyOwnership;

    return {
        id: `company_ownership_${id}`,
        type: 'default',
        source: `company_${parent.id}`,
        target: `company_${subsidiary.id}`,
        data: {
            originalId: id,
            level,
        },
    };
};
