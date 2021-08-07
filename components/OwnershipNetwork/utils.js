/* eslint-disable camelcase */
import { DataSet } from 'vis';
import _partition from 'lodash/partition';
import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';

const colors = {
  red: '#ffadad',
  green: '#adffad',
  purple: '#adadff',
  white: '#fff',
};

export const X_DISTANCE = 20;
export const Y_DISTANCE = 10;
const MIN_HEIGHT = 40;
const MIN_WIDTH = 130;

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

  const [realCompanies, groupCompanies] = _partition(
    companies,
    (company) =>
      !company.group_company || company.group_company.id !== company.id,
  );

  const companyNodes = realCompanies.map(
    ({
      id,
      name,
      is_comm,
      picture,
      parent_relation,
      group_company,
      xPosition,
      yPosition,
    }) => {
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
        groupCompany: group_company && group_company.id,
        x: xPosition === null ? id * X_DISTANCE : xPosition,
        y: yPosition === null ? defaultCompanyYPosition : yPosition,
        borderWidth: companySize === 'big' ? 4 : 2,
        color: companyType === 'comm' ? colors.purple : colors.green,
        heightConstraint: MIN_HEIGHT,
        image: imageUrl,
        shape,
        shapeProperties: {
          useBorderWithImage: true,
          borderRadius: 0,
        },
        widthConstraint: MIN_WIDTH,
      };
    },
  );

  const groupCompanyNodes = groupCompanies
    // Ignore groups that do not have real companies
    .filter(({ id }) =>
      companyNodes.find((company) => company.groupCompany === id),
    )
    .map(({ id, name }) => {
      const partneredCompanyNodes = companyNodes.filter(
        (company) => company.groupCompany === id,
      );

      const minX = _minBy(partneredCompanyNodes, 'x').x;
      const maxX = _maxBy(partneredCompanyNodes, 'x').x;
      const centerX = (minX + maxX) / 2;
      const marginX = (maxX - minX) / 2 + 10;
      const minY = _minBy(partneredCompanyNodes, 'y').y;
      const maxY = _maxBy(partneredCompanyNodes, 'y').y;
      const centerY = (minY + maxY) / 2;
      const marginY = maxY - minY;

      return {
        id: `groupCompany_${id}`,
        label: name,
        x: centerX,
        y: centerY - MIN_HEIGHT / 2,
        borderWidth: 4,
        color: colors.white,
        margin: {
          left: marginX,
          right: marginX,
          top: 5,
          bottom: marginY + 55,
        },
        heightConstraint: 40,
        shape: 'box',
        shapeProperties: {
          borderRadius: 0,
        },
        widthConstraint: 130,
      };
    });

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

  const nodes = [].concat(groupCompanyNodes, peopleNodes, companyNodes);
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
