import React from 'react';
import { Network } from 'vis';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { parseToVisNetwork, X_DISTANCE, Y_DISTANCE } from './utils';
import { changeNodePosition } from '../../lib/api';

const NetworkContainer = styled.div`
  border: 1px solid lightgray;
`;

export default class OwnershipNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.networkRef = React.createRef();
  }

  moveNode = (e) => {
    const movedNodeId = e.nodes[0];
    if (!movedNodeId) return;

    const newPosition = this.network.getPositions(movedNodeId)[movedNodeId];
    const roundedPosition = {
      x: Math.round(newPosition.x / X_DISTANCE) * X_DISTANCE,
      y: Math.round(newPosition.y / Y_DISTANCE) * Y_DISTANCE,
    };
    this.network.moveNode(movedNodeId, roundedPosition.x, roundedPosition.y);
    if (this.props.user.role.type === 'editor') {
      changeNodePosition(movedNodeId, roundedPosition.x, roundedPosition.y);
    }
  };

  componentDidMount() {
    const {
      user,
      people,
      companies,
      companyOwnerships,
      ownerships,
      relationships,
    } = this.props;
    const data = parseToVisNetwork({
      user,
      people,
      companies,
      companyOwnerships,
      ownerships,
      relationships,
    });
    const container = document.getElementById('mynetwork');
    const options = {
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
    this.network.on('dragEnd', this.moveNode);
  }

  render() {
    return <NetworkContainer id="mynetwork" ref={this.networkRef} />;
  }
}

OwnershipNetwork.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    role: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }),
  people: PropTypes.array,
  companies: PropTypes.array,
  companyOwnerships: PropTypes.array,
  ownerships: PropTypes.array,
  relationships: PropTypes.array,
};
