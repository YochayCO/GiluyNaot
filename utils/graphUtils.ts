import { Edge, Elements, Node } from 'react-flow-renderer';

import Company from '../types/Company';
import { CompanyOwnership, Ownership, OwnershipLevel } from '../types/Ownerships';
import { Entities } from '../types/Entities';
import Person from '../types/Person';
import Relationship from '../types/Relationship';

const INITIAL_NODE_POSITION = { x: 0, y: 0 };

export interface NodeViewData {
    originalId: string;
    label: string;
}

export interface OwnershipEdgeData {
    originalId: string;
    level: OwnershipLevel;
}

export interface RelationshipEdgeData {
    originalId: string;
    relationType: string;
}

export type GraphElementViewData = NodeViewData | OwnershipEdgeData | RelationshipEdgeData;
export type GraphElements<T = GraphElementViewData> = Elements<T>;

export const createPersonElement = (person: Person): Node<NodeViewData> => {
    const { id, name } = person;

    return {
        id: `person_${id}`,
        // type: 'company',
        data: {
            originalId: id,
            label: name,
        },
        position: INITIAL_NODE_POSITION,
    };
};

export const createCompanyElement = (company: Company): Node<NodeViewData> => {
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

export const createCompanyOwnershipEdge = (companyOwnership: CompanyOwnership): Edge<OwnershipEdgeData> => {
    const { id, parent, subsidiary, level } = companyOwnership;

    return {
        id: `company_ownership_${id}`,
        type: 'default',
        source: `company_${parent!.id}`,
        target: `company_${subsidiary!.id}`,
        data: {
            originalId: id,
            level,
        },
    };
};

export const createOwnershipEdge = (ownership: Ownership): Edge<OwnershipEdgeData> => {
    const { id, owner, company, level } = ownership;

    return {
        id: `ownership_${id}`,
        type: 'default',
        source: `person_${owner!.id}`,
        target: `company_${company!.id}`,
        data: {
            originalId: id,
            level,
        },
    };
};

export const createRelationshipEdge = (relationship: Relationship): Edge<RelationshipEdgeData> => {
    const { id, relative_1, relative_2, relationType } = relationship;

    return {
        id: `ownership_${id}`,
        type: 'default',
        source: `person_${relative_1!.id}`,
        target: `person_${relative_2!.id}`,
        data: {
            originalId: id,
            relationType,
        },
    };
};

export const mapEntitiesToElements = ({
    people,
    companies,
    companyOwnerships,
    ownerships,
    relationships,
}: Entities) => {
    if (!companies || !companyOwnerships || !people || !ownerships || !relationships)
        throw new Error('Some error with entities');

    const peopleElements = people.map(createPersonElement);
    const companyElements = companies.map(createCompanyElement);
    const companyOwnershipEdges = companyOwnerships
        .filter((c) => c.subsidiary && c.parent)
        .map(createCompanyOwnershipEdge);
    const ownershipEdges = ownerships.filter((o) => o.company && o.owner).map(createOwnershipEdge);
    const relationshipEdges = relationships.filter((r) => r.relative_1 && r.relative_2).map(createRelationshipEdge);

    return [...peopleElements, ...companyElements, ...companyOwnershipEdges, ...ownershipEdges, ...relationshipEdges];
};
