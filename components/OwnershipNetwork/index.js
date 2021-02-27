import React from 'react';
import { Network } from 'vis';
import styled from 'styled-components';

import { parseNetwork } from './utils';

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
    const data = parseNetwork(this.props);
    const container = document.getElementById('mynetwork');
    const options = {};
    this.network = new Network(container, data, options);
    this.network.once('afterDrawing', () => {
      container.style.height = '85vh';
    });
  }

  render() {
    return <NetworkContainer id="mynetwork" ref={this.networkRef} />;
  }
}
