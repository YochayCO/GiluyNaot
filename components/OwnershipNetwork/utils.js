/* eslint-disable camelcase */
import { DataSet } from 'vis';

const colors = {
  red: '#ffadad',
  green: '#adffad',
  purple: '#adadff',
};

export function parseToVisNetwork({
  people,
  companies,
  companyOwnerships,
  ownerships,
  relationships,
}) {
  const peopleNodes = people.map(({ id, name, picture }) => {
    let imageUrl;
    let shape = 'circle';
    if (picture) {
      imageUrl = `/api${picture.url}`;
      shape = 'circularImage';
    }

    return {
      id: `person_${id}`,
      label: name,
      level: 1,
      borderWidth: 4,
      color: colors.red,
      image: imageUrl,
      shape,
      size: 43,
      shapeProperties: {
        useBorderWithImage: true,
      },
      widthConstraint: 80,
    };
  });

  const companyNodes = companies.map(
    ({ id, name, is_comm, picture, parent_relation }) => {
      const companyType = is_comm ? 'comm' : 'profit';
      const companySize = parent_relation ? 'small' : 'big';
      let imageUrl;
      let shape = 'box';
      if (picture) {
        imageUrl = `/api${picture.url}`;
        shape = 'image';
      }

      return {
        id: `company_${id}`,
        label: name,
        level: companySize === 'big' ? 2 : 3,
        borderWidth: companySize === 'big' ? 4 : 2,
        color: companyType === 'comm' ? colors.purple : colors.green,
        heightConstraint: 40,
        image: imageUrl,
        shape,
        shapeProperties: {
          useBorderWithImage: true,
        },
        widthConstraint: 130,
      };
    },
  );
  const companyOwnershipEdges = companyOwnerships.map(
    ({ id, parent, subsidiary, level }) => ({
      id: `companyOwnership_${id}`,
      from: `company_${parent.id}`,
      to: `company_${subsidiary.id}`,
      color: { color: '#000000' },
      dashes: level === 'partial',
    }),
  );
  const ownershipEdges = ownerships.map(({ id, owner, company, level }) => ({
    id: `ownership_${id}`,
    from: `person_${owner.id}`,
    to: `company_${company.id}`,
    color: { color: '#000000' },
    dashes: level === 'partial',
  }));
  const relationshipEdges = relationships.map(
    ({ id, relative_1, relative_2, relationType }) => ({
      id: `relationship_${id}`,
      label: relationType,
      from: `person_${relative_1.id}`,
      to: `person_${relative_2.id}`,
      arrows: {
        from: true,
      },
    }),
  );

  const nodes = [].concat(peopleNodes, companyNodes);
  const edges = [].concat(
    companyOwnershipEdges,
    ownershipEdges,
    relationshipEdges,
  );

  return {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges),
  };
}
