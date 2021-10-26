/* eslint-disable camelcase */
import { DataSet } from 'vis';
import _partition from 'lodash/partition';
import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';
import { toInteger } from 'lodash';

const colors = {
  partial: '#7f8b8c',
  full: '#282b2b',
  green: '#adffad',
  purple: '#adadff',
  red: '#ff0000',
  white: '#ffffff88',
};

export const X_DISTANCE = 20;
export const Y_DISTANCE = 10;
const MIN_HEIGHT = 40;
const MIN_WIDTH = 130;

function getPosition({ id, network_section_id, xPosition, yPosition }) {
  if (xPosition && yPosition) return { x: xPosition, y: yPosition };
  return {
    x: ((network_section_id || 0) / 10) * 100 + id * X_DISTANCE * 5,
    y: toInteger((network_section_id || 0) % 10) * 100,
  };
}

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
    ({ id, name, picture, network_section_id, xPosition, yPosition }) => {
      let imageUrl;
      let shape = 'circle';
      const position = getPosition({
        id,
        network_section_id,
        xPosition,
        yPosition,
      });
      if (picture) {
        imageUrl = `/api${picture.url}`;
        shape = 'circularImage';
      }

      return {
        id: `person_${id}`,
        label: name,
        x: position.x,
        y: position.y,
        color: colors.partial,
        font: { color: '#fff' },
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
      group_company,
      network_section_id,
      xPosition,
      yPosition,
    }) => {
      const companyType = is_comm ? 'comm' : 'profit';
      const position = getPosition({
        id,
        network_section_id,
        xPosition,
        yPosition,
      });
      let imageUrl;
      let shape = 'box';
      if (picture) {
        imageUrl = `/api${picture.url}`;
        shape = 'image';
      }

      return {
        id: `company_${id}`,
        label: name,
        groupCompany: group_company && group_company.id,
        x: position.x,
        y: position.y,
        borderWidth: 2,
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
        color: { background: colors.white, border: colors.purple },
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

  const companyOwnershipEdges = companyOwnerships
    .filter(({ parent, subsidiary }) => parent && subsidiary)
    .map(({ id, parent, subsidiary, level }) => {
      let parentIdType = 'company';
      let subsidiaryIdType = 'company';
      if (parent.group_company && parent.group_company.id === parent.id) {
        parentIdType = 'groupCompany';
      }
      if (
        subsidiary.group_company &&
        subsidiary.group_company.id === subsidiary.id
      ) {
        subsidiaryIdType = 'groupCompany';
      }

      return {
        id: `companyOwnership_${id}`,
        from: `${parentIdType}_${parent.id}`,
        to: `${subsidiaryIdType}_${subsidiary.id}`,
        color: { color: colors[level] },
        arrowStrikethrough: false,
        dashes: level === 'partial',
        smooth,
      };
    });

  const ownershipEdges = ownerships
    .filter(({ owner, company }) => owner && company)
    .map(({ id, owner, company, level }) => {
      let companyIdType = 'company';

      if (company.group_company && company.group_company.id === company.id) {
        companyIdType = 'groupCompany';
      }

      if (level === 'full') {
        const ownerNode = peopleNodes.find(
          (personNode) => personNode.id === `person_${owner.id}`,
        );
        if (ownerNode) {
          ownerNode.color = colors.full;
        }
      }

      return {
        id: `ownership_${id}`,
        from: `person_${owner.id}`,
        to: `${companyIdType}_${company.id}`,
        color: { color: colors[level] },
        arrowStrikethrough: false,
        dashes: level === 'partial',
        smooth,
      };
    });

  const relationshipEdges = relationships
    .filter(({ relative_1, relative_2 }) => relative_1 && relative_2)
    .map(({ id, relative_1, relative_2, relationType }) => ({
      id: `relationship_${id}`,
      label: relationType,
      from: `person_${relative_1.id}`,
      to: `person_${relative_2.id}`,
      color: colors.red,
      smooth: { type: 'diagonalCross' },
      arrows: {
        from: true,
      },
    }));

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
