/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
    size?: number;
    isParent?: boolean;
    networkSectionId: number;
}

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
    const { id, name, network_section_id } = person;

    return {
        id: `person_${id}`,
        // type: 'company',
        data: {
            originalId: id,
            label: `${name} ${network_section_id}`,
            networkSectionId: network_section_id || -1,
        },
        position: INITIAL_NODE_POSITION,
    };
};

const createCompanyElements = (companies: Company[]): Node<NodeViewData>[] => {
    const mainCompObjs: { id: string; comp?: Company; size: number }[] = [];
    companies.forEach((comp) => {
        const mainId = comp.group_company?.id || comp.id;

        if (!mainCompObjs.find((compObj) => compObj.id === mainId)) {
            mainCompObjs.push({ id: mainId, size: 1 });
        }
        if (mainId === comp.id) {
            const mainCompObj = mainCompObjs.find((compObj) => compObj.id === mainId);
            mainCompObj!.comp = comp;
        }
    });

    const mainCompElements = mainCompObjs.map(({ id, comp, size }) => ({
        id: `company_${id}`,
        // type: 'company',
        data: {
            originalId: id,
            label: `${comp?.name} ${comp?.network_section_id}` || '???',
            size,
            isParent: size > 1,
            networkSectionId: comp?.network_section_id || -1,
        },
        position: INITIAL_NODE_POSITION,
    }));

    return mainCompElements;
};

// const createCompanyElement = (company: Company): Node<NodeViewData> => {
//     const { id, name } = company;

//     return {
//         id: `company_${id}`,
//         // type: 'company',
//         data: {
//             originalId: id,
//             label: name,
//         },
//         position: INITIAL_NODE_POSITION,
//     };
// };

const createCompanyOwnershipEdges = (
    companyOwnerships: CompanyOwnership[],
    companies: Company[],
): Edge<OwnershipEdgeData>[] => {
    const validCompOwnerships = companyOwnerships.filter((c) => c.subsidiary && c.parent);
    const companyOwnershipEdges = validCompOwnerships.map((ownership) => {
        const { id, parent, subsidiary, level } = ownership;
        const parentComp = companies.find((comp) => comp.id === parent!.id);
        const parentGroupCompId = parentComp?.group_company?.id || parent!.id;

        const subsidiaryComp = companies.find((comp) => comp.id === subsidiary!.id);
        const subsidiaryGroupCompId = subsidiaryComp?.group_company?.id || subsidiary!.id;

        return {
            id: `company_ownership_${id}`,
            type: 'default',
            source: `company_${parentGroupCompId}`,
            target: `company_${subsidiaryGroupCompId}`,
            data: {
                originalId: id,
                level,
                networkSectionId: parentComp?.network_section_id || subsidiaryComp?.network_section_id || -1,
            },
        };
    });

    return companyOwnershipEdges;
};

// const createCompanyOwnershipEdge = (companyOwnership: CompanyOwnership): Edge<OwnershipEdgeData> => {
//     const { id, parent, subsidiary, level } = companyOwnership;

//     return {
//         id: `company_ownership_${id}`,
//         type: 'default',
//         source: `company_${parent!.id}`,
//         target: `company_${subsidiary!.id}`,
//         data: {
//             originalId: id,
//             level,
//         },
//     };
// };

const createOwnershipEdges = (ownerships: Ownership[], companies: Company[]): Edge<OwnershipEdgeData>[] => {
    const validOwnerships = ownerships.filter((o) => o.company && o.owner);
    const ownershipEdges = validOwnerships.map((o) => {
        const { id, owner, company, level } = o;

        const childComp = companies.find((comp) => comp.id === company!.id);
        const childGroupCompId = childComp?.group_company?.id || childComp!.id;

        return {
            id: `ownership_${id}`,
            type: 'default',
            source: `person_${owner!.id}`,
            target: `company_${childGroupCompId}`,
            data: {
                originalId: id,
                level,
                networkSectionId: owner?.network_section_id || childComp?.network_section_id || -1,
            },
        };
    });

    return ownershipEdges;
};

// const createOwnershipEdge = (ownership: Ownership): Edge<OwnershipEdgeData> => {
//     const { id, owner, company, level } = ownership;

//     return {
//         id: `ownership_${id}`,
//         type: 'default',
//         source: `person_${owner!.id}`,
//         target: `company_${company!.id}`,
//         data: {
//             originalId: id,
//             level,
//         },
//     };
// };

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
}: Entities) => {
    if (!companies || !companyOwnerships || !people || !ownerships || !relationships)
        throw new Error('Some error with entities');

    const peopleElements = people.map(createPersonElement);
    const companyElements = createCompanyElements(companies);
    const companyOwnershipEdges = createCompanyOwnershipEdges(companyOwnerships, companies);
    const ownershipEdges = createOwnershipEdges(ownerships, companies);
    const relationshipEdges = relationships.filter((r) => r.relative_1 && r.relative_2).map(createRelationshipEdge);

    return [...peopleElements, ...companyElements, ...companyOwnershipEdges, ...ownershipEdges, ...relationshipEdges];
};
