import React from 'react';
// import PropTypes from 'prop-types';
import { DataSet, Network } from 'vis';
import styled from 'styled-components';
const NetworkContainer = styled.div`
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
`;

// TODO: represent child companies in network
// const ChildCompaniesList = ({ childCompanies }) => {
//   const ChildComponents = childCompanies.map((label, isComm) => {
//     const className = isComm ? 'comm-biz' : 'biz';
//     return <ul className={className}>{label}</ul>;
//   });
//   return <li>{ChildComponents}</li>;
// };
// ChildCompaniesList.propTypes = {
//   childCompanies: PropTypes.array,
// };

function parseNodes(people, companies) {
  const bigCompanies = companies.filter(company => !!company.data.owners);
  const nodeCompanies = bigCompanies.map(({ id, label, childCompanies }) => ({
    id,
    label,
    childCompanies,
  }));

  const nodePeople = people.map(({ id, label }) => ({ id, label }));

  return new DataSet([...nodeCompanies, ...nodePeople]);
}

function parseEdges(people) {
  const edges = people
    .map(({ id, data }) => {
      const { owns, relatives } = data;

      const ownEdges = owns.map(companyId => ({
        from: id,
        to: companyId,
        stam: 'bla',
      }));
      const relationEdges = relatives.map(({ id: relativeId }) => ({
        from: id,
        to: relativeId,
      }));

      return [...ownEdges, ...relationEdges];
    })
    .flat()
    .reduce((uniqueEdges, currEdge) => {
      if (
        uniqueEdges.some(
          ({ to, from }) => to === currEdge.from && from === currEdge.to,
        )
      ) {
        return uniqueEdges;
      }
      return uniqueEdges.concat(currEdge);
    }, []);
  return new DataSet(edges);
}

function parseNetwork(people, companies) {
  const nodes = parseNodes(people, companies);
  const edges = parseEdges(people, companies);

  return { nodes, edges };
}

export default class OwnershipNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.networkRef = React.createRef();
  }

  componentDidMount() {
    // create an array with nodes
    const people = [
      {
        id: 5,
        label: 'ענת אגמון',
        data: { relatives: [{ id: 8, relation: 'divorced' }], owns: [1] },
      },
      {
        id: 6,
        label: 'אלונה בר-און',
        data: { relatives: [{ id: 10, relation: 'daughter' }], owns: [1, 7] },
      },
      {
        id: 8,
        label: 'מריוס נכט',
        data: { relatives: [{ id: 5, relation: 'divorced' }], owns: [9] },
      },
      {
        id: 10,
        label: 'עדנה בר-און',
        data: { relatives: [{ id: 6, relation: 'mother' }], owns: [] },
      },
    ];

    const companies = [
      {
        id: 1,
        label: 'גלובס',
        data: {
          owners: [{ id: 6, percent: 100 }],
          childCompanies: [2, 3, 4],
          isComm: true,
        },
      },
      {
        id: 2,
        label: 'יומון כלכלי',
        data: { fatherCompany: 'globes', isComm: true },
      },
      {
        id: 3,
        label: 'דפוס כספים',
        data: { fatherCompany: 'globes', isComm: true },
      },
      {
        id: 4,
        label: 'אתר גלובס',
        data: { fatherCompany: 'globes', isComm: true },
      },
      {
        id: 7,
        label: 'בית וגג',
        data: { owners: [{ id: 6, percent: 100 }] },
      },
      {
        id: 9,
        label: `צ'ק פוינט`,
        data: { owners: [{ id: 8, percent: 100 }] },
      },
    ];

    const data = parseNetwork(people, companies);

    // create a network
    const container = document.getElementById('mynetwork');
    const options = {};
    this.network = new Network(container, data, options);
  }

  render() {
    return <NetworkContainer id="mynetwork" ref={this.networkRef} />;
  }
}
