import { DataSet } from 'vis';

export function parseNetwork({ people, companies, companyOwnerships, ownerships, relationships }) {    
  const peopleNodes = people.map(({ id, name }) => ({
    id: `person_${id}`,
    label: name,
    group: 'person',
  }));
  const companyNodes = companies.map(({ id, name, is_comm, parent_relation }) => {
    const companyType = is_comm ? 'comm' : 'profit';
    const companySize = parent_relation ? 'small' : 'big';

    return ({
      id: `company_${id}`,
      label: name,
      group: `${companySize}_${companyType}_company`,
    }) 
  });
  const companyOwnershipEdges = companyOwnerships.map(({ id, parent, subsidiary }) => ({
    id: `companyOwnership_${id}`,
    from: `company_${parent.id}`,
    to: `company_${subsidiary.id}`,
  }));
  const ownershipEdges = ownerships.map(({ id, owner, company }) => ({
    id: `ownership_${id}`,
    from: `person_${owner.id}`,
    to: `company_${company.id}`,
  }));
  const relationshipEdges = relationships.map(({ id, relative_1, relative_2, relationType }) => ({
    id: `relationship_${id}`,
    label: relationType,
    from: `person_${relative_1.id}`,
    to: `person_${relative_2.id}`,
    arrows: {
      from: true,
    }
  }));

  const nodes = [].concat(peopleNodes, companyNodes);
  const edges = [].concat(companyOwnershipEdges, ownershipEdges, relationshipEdges);

  return {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges),
  }
}
