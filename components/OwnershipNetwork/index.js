import React from 'react';
import { Network } from 'vis';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { parseToVisNetwork } from './utils';

const NetworkContainer = styled.div`
  border: 1px solid lightgray;
`;

export default class OwnershipNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.networkRef = React.createRef();
  }

  componentDidMount() {
    const {
      deployMode,
      people,
      companies,
      companyOwnerships,
      ownerships,
      relationships,
    } = this.props;
    const data = parseToVisNetwork({
      deployMode,
      people,
      companies,
      companyOwnerships,
      ownerships,
      relationships,
    });
    const container = document.getElementById('mynetwork');
    const options = {
      layout: {
        hierarchical: {
          nodeSpacing: 200,
        },
      },
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true,
      },
      nodes: {
        font: {
          size: 15,
        },
      },
      edges: {
        width: 2,
        arrows: {
          to: true,
        },
      },
    };
    this.network = new Network(container, data, options);
    this.network.once('afterDrawing', () => {
      container.style.height = '90vh';
    });
  }

  render() {
    return <NetworkContainer id="mynetwork" ref={this.networkRef} />;
  }
}

OwnershipNetwork.propTypes = {
  deployMode: PropTypes.string,
  people: PropTypes.array,
  companies: PropTypes.array,
  companyOwnerships: PropTypes.array,
  ownerships: PropTypes.array,
  relationships: PropTypes.array,
};