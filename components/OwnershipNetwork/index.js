import React from 'react';
import { Network } from 'vis';
import styled from 'styled-components';

import { parseNetwork } from './utils';

const NetworkContainer = styled.div`
  border: 1px solid lightgray;
`;

const colors = {
  red: '#ffadad',
  green: '#adffad',
  purple: '#adadff',
};

export default class OwnershipNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.networkRef = React.createRef();
  }

  componentDidMount() {
    const data = parseNetwork(this.props);
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
      groups: {
        person: {
          level: 1,
          shape: 'circle',
          widthConstraint: 80,
          color: colors.red,
        },
        big_profit_company: {
          shape: 'box',
          widthConstraint: 130,
          heightConstraint: 70,
          level: 2,
          color: colors.green,
        },
        small_profit_company: {
          shape: 'box',
          widthConstraint: 130,
          heightConstraint: 40,
          level: 3,
          color: colors.green,
        },
        big_comm_company: {
          shape: 'box',
          widthConstraint: 130,
          heightConstraint: 70,
          level: 2,
          color: colors.purple,
        },
        small_comm_company: {
          shape: 'box',
          widthConstraint: 130,
          heightConstraint: 40,
          level: 3,
          color: colors.purple,
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
      container.style.height = '85vh';
    });
  }

  render() {
    return <NetworkContainer id="mynetwork" ref={this.networkRef} />;
  }
}
