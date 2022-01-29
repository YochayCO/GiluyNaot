/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Edge, Elements, Node } from 'react-flow-renderer';
import _partition from 'lodash/partition';

import Company from '../types/Company';
import { CompanyOwnership, Ownership, OwnershipLevel } from '../types/Ownerships';
import { GraphEntities } from '../types/Entities';
import Person from '../types/Person';
import Relationship from '../types/Relationship';

const INITIAL_NODE_POSITION = { x: 0, y: 0 };

export interface CompanyNodeViewData {
    originalId: string;
    label: string;
    childrenIds?: string[];
    groupCompany?: string;
    networkSectionId: number;
    isComm?: boolean;
    dimensions?: { width: number; height: number };
}

export interface PersonNodeViewData {
    originalId: string;
    label: string;
    size?: number;
    isParent?: boolean;
    networkSectionId: number;
}

export type NodeViewData = CompanyNodeViewData | PersonNodeViewData;

export interface OwnershipEdgeData {
    originalId: string;
    level: OwnershipLevel;
    networkSectionId: number;
}

export interface RelationshipEdgeData {
    originalId: string;
    relationType: string;
    networkSectionId: number;
}

export type GraphElementViewData = NodeViewData | OwnershipEdgeData | RelationshipEdgeData;
export type GraphElements<T = GraphElementViewData> = Elements<T>;

export const createPersonElement = (person: Person): Node<NodeViewData> => {
    const { id, name, network_section_id, xPosition, yPosition } = person;

    return {
        id: `person_${id}`,
        type: 'person',
        data: {
            originalId: id,
            label: `${name} ${network_section_id}`,
            networkSectionId: network_section_id || -1,
        },
        position: xPosition && yPosition ? { x: xPosition, y: yPosition } : INITIAL_NODE_POSITION,
    };
};

const createCompanyElements = (companies: Company[]): Node<NodeViewData>[] => {
    const [secondaryComps, mainComps] = _partition(
        companies,
        (comp) => !comp.group_company?.id || comp.group_company.id !== comp.id,
    );

    const secondaryCompElements = secondaryComps.map(
        ({ id, name, network_section_id, is_comm, xPosition, yPosition, group_company }) => {
            const generateCompanyId = (d: string) => `company_${d}`;
            return {
                id: generateCompanyId(id),
                type: 'company',
                data: {
                    originalId: id,
                    label: name || '???',
                    networkSectionId: network_section_id || -1,
                    isComm: is_comm,
                    groupCompany: group_company ? generateCompanyId(group_company.id) : null,
                },
                position: xPosition && yPosition ? { x: xPosition, y: yPosition } : INITIAL_NODE_POSITION,
            };
        },
    );

    const mainCompElements = mainComps.map((mc) => {
        const elementId = `company_${mc.id}`;
        return {
            id: elementId,
            type: 'groupCompany',
            data: {
                originalId: mc.id,
                label: mc.name || '???',
                childrenIds: secondaryCompElements.filter((c) => c.data.groupCompany === elementId).map((c) => c.id),
                networkSectionId: mc.network_section_id || -1,
                isComm: mc.is_comm,
            },
            position: mc.xPosition && mc.yPosition ? { x: mc.xPosition, y: mc.yPosition } : INITIAL_NODE_POSITION,
        };
    });

    // mainCompElements.forEach((mainCompEl) => {
    //     const secondaryCompEles = secondaryCompElements.filter((comp) => comp.data.groupCompany);
    //     applyPositionsAndDimentionsToGroup(mainCompEl, secondaryCompEles);
    // });

    return [...mainCompElements, ...secondaryCompElements];
};

type SafeCompanyOwnership = CompanyOwnership & { subsidiary: Company; parent: Company };

const createCompanyOwnershipEdges = (
    companyOwnerships: CompanyOwnership[],
    companies: Company[],
): Edge<OwnershipEdgeData>[] => {
    const validCompOwnerships: SafeCompanyOwnership[] = companyOwnerships.filter(
        (c) => c.subsidiary && c.parent,
    ) as SafeCompanyOwnership[];
    const companyOwnershipEdges = validCompOwnerships.map((ownership) => {
        const { id, parent, subsidiary, level } = ownership;
        const parentComp = companies.find((comp) => comp.id === parent.id);

        const subsidiaryComp = companies.find((comp) => comp.id === subsidiary.id);

        return {
            id: `company_ownership_${id}`,
            type: 'default',
            source: `company_${parentComp?.id}`,
            target: `company_${subsidiaryComp?.id}`,
            data: {
                originalId: id,
                level,
                networkSectionId: parentComp?.network_section_id || subsidiaryComp?.network_section_id || -1,
            },
        };
    });

    return companyOwnershipEdges;
};

const createOwnershipEdges = (ownerships: Ownership[], companies: Company[]): Edge<OwnershipEdgeData>[] => {
    const validOwnerships = ownerships.filter((o) => o.company && o.owner);
    const ownershipEdges = validOwnerships.map((o) => {
        const { id, owner, company, level } = o;

        const childComp = companies.find((comp) => comp.id === company!.id);

        return {
            id: `ownership_${id}`,
            type: 'default',
            source: `person_${owner!.id}`,
            target: `company_${childComp?.id}`,
            data: {
                originalId: id,
                level,
                networkSectionId: owner?.network_section_id || childComp?.network_section_id || -1,
            },
        };
    });

    return ownershipEdges;
};

const createRelationshipEdge = (relationship: Relationship): Edge<RelationshipEdgeData> => {
    const { id, relative_1, relative_2, relationType } = relationship;

    return {
        id: `ownership_${id}`,
        type: 'default',
        source: `person_${relative_1!.id}`,
        target: `person_${relative_2!.id}`,
        data: {
            originalId: id,
            relationType,
            networkSectionId: relative_1.network_section_id || relative_2.network_section_id || -1,
        },
    };
};

export const mapEntitiesToElements = ({
    people,
    companies,
    companyOwnerships,
    ownerships,
    relationships,
}: GraphEntities): { nodes: Node[]; edges: Edge[] } => {
    if (!companies || !companyOwnerships || !people || !ownerships || !relationships)
        throw new Error('Some essential data could not be fetched from server');

    const peopleElements = people.map(createPersonElement);
    const companyElements = createCompanyElements(companies);
    const companyOwnershipEdges = createCompanyOwnershipEdges(companyOwnerships, companies);
    const ownershipEdges = createOwnershipEdges(ownerships, companies);
    const relationshipEdges = relationships.filter((r) => r.relative_1 && r.relative_2).map(createRelationshipEdge);

    return {
        nodes: [...companyElements, ...peopleElements],
        edges: [...companyOwnershipEdges, ...ownershipEdges, ...relationshipEdges],
    };
};
