/* eslint-disable camelcase */
import { DataSet } from 'vis';

const colors = {
  red: '#ffadad',
  green: '#adffad',
  purple: '#adadff',
};

export const X_DISTANCE = 200;
export const Y_DISTANCE = 150;

export function parseToVisNetwork({
  user,
  people,
  companies,
  companyOwnerships,
  ownerships,
  relationships,
}) {
  const smooth = {
    type: user.role.type === 'editor' ? 'discrete' : 'dynamic',
  };

  const peopleNodes = people.map(
    ({ id, name, picture, xPosition, yPosition }) => {
      let imageUrl;
      let shape = 'circle';
      if (picture) {
        imageUrl = `/api${picture.url}`;
        shape = 'circularImage';
      }

      return {
        id: `person_${id}`,
        label: name,
        x: xPosition === null ? id * X_DISTANCE : xPosition,
        y: yPosition === null ? -1 * Y_DISTANCE : yPosition,
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
    },
  );

  const companyNodes = companies.map(
    ({ id, name, is_comm, picture, parent_relation, xPosition, yPosition }) => {
      const companyType = is_comm ? 'comm' : 'profit';
      const companySize = parent_relation ? 'small' : 'big';
      let imageUrl;
      let shape = 'box';
      if (picture) {
        imageUrl = `/api${picture.url}`;
        shape = 'image';
      }
      const defaultCompanyYPosition = companySize === 'big' ? 0 : Y_DISTANCE;

      return {
        id: `company_${id}`,
        label: name,
        x: xPosition === null ? id * X_DISTANCE : xPosition,
        y: yPosition === null ? defaultCompanyYPosition : yPosition,
        borderWidth: companySize === 'big' ? 4 : 2,
        color: companyType === 'comm' ? colors.purple : colors.green,
        heightConstraint: 40,
        image: imageUrl,
        shape,
        shapeProperties: {
          useBorderWithImage: true,
          borderRadius: 0,
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
      smooth,
    }),
  );
  const ownershipEdges = ownerships.map(({ id, owner, company, level }) => ({
    id: `ownership_${id}`,
    from: `person_${owner.id}`,
    to: `company_${company.id}`,
    color: { color: '#000000' },
    dashes: level === 'partial',
    smooth,
  }));
  const relationshipEdges = relationships.map(
    ({ id, relative_1, relative_2, relationType }) => ({
      id: `relationship_${id}`,
      label: relationType,
      from: `person_${relative_1.id}`,
      to: `person_${relative_2.id}`,
      smooth: { type: 'diagonalCross' },
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
