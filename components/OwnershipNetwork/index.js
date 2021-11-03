import React from 'react';
import dagre from 'dagre';
import { DataSet, Network } from 'vis';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  parseToVisNetwork,
  X_DISTANCE,
  Y_DISTANCE,
  MIN_HEIGHT,
  MIN_WIDTH,
} from './utils';
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

    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(() => ({}));

    data.nodes.forEach((node) =>
      g.setNode(node.id, { ...node, width: 50, height: 30 }),
    );
    data.edges.forEach((edge) => g.setEdge(edge.from, edge.to));

    dagre.layout(g);

    console.log(data.edges.length);

    const nodes = g
      .nodes()
      .map((node) => g.node(node))
      .filter((node) => !!node);

    console.log(nodes);

    const positionedData = {
      nodes: new DataSet(nodes),
      edges: data.edges,
    };

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
    this.network = new Network(container, positionedData, options);
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
