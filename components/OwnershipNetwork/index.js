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
          borderWidth: 4,
          color: colors.red,
          level: 1,
          size: 43,
          shapeProperties: {
            useBorderWithImage: true,
          },
          widthConstraint: 80,
        },
        big_profit_company: {
          borderWidth: 4,
          color: colors.green,
          heightConstraint: 40,
          level: 2,
          widthConstraint: 130,
        },
        small_profit_company: {
          color: colors.green,
          heightConstraint: 40,
          level: 3,
          widthConstraint: 130,
        },
        big_comm_company: {
          borderWidth: 4,
          color: colors.purple,
          heightConstraint: 40,
          level: 2,
          shapeProperties: {
            useBorderWithImage: true,
          },
          widthConstraint: 130,
        },
        small_comm_company: {
          color: colors.purple,
          heightConstraint: 40,
          level: 3,
          widthConstraint: 130,
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
