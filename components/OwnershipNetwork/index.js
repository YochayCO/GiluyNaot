import React from 'react';
import Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import HighchartsReact from 'highcharts-react-official';

import { parseNetwork } from './utils';

if (typeof Highcharts === 'object') {
  HighchartsNetworkGraph(Highcharts);
}

export default class OwnershipNetwork extends React.Component {
  constructor(props) {
    super(props);
    // create an array with nodes
    const people = [
      {
        id: 5,
        name: 'ענת אגמון',
        data: { relatives: [{ id: 8, relation: 'divorced' }], owns: [1] },
      },
      {
        id: 6,
        name: 'אלונה בר-און',
        data: { relatives: [{ id: 10, relation: 'daughter' }], owns: [1, 7] },
      },
      {
        id: 8,
        name: 'מריוס נכט',
        data: { relatives: [{ id: 5, relation: 'divorced' }], owns: [9] },
      },
      {
        id: 10,
        name: 'עדנה בר-און',
        data: { relatives: [{ id: 6, relation: 'mother' }], owns: [] },
      },
    ];

    const companies = [
      {
        id: 1,
        name: 'גלובס',
        data: {
          owners: [{ id: 6, percent: 100 }],
          childCompanies: [2, 3, 4],
          isComm: true,
        },
      },
      {
        id: 2,
        name: 'יומון כלכלי',
        data: { fatherCompany: 'globes', isComm: true },
      },
      {
        id: 3,
        name: 'דפוס כספים',
        data: { fatherCompany: 'globes', isComm: true },
      },
      {
        id: 4,
        name: 'אתר גלובס',
        data: { fatherCompany: 'globes', isComm: true },
      },
      {
        id: 7,
        name: 'בית וגג',
        data: { owners: [{ id: 6, percent: 100 }] },
      },
      {
        id: 9,
        name: `צ'ק פוינט`,
        data: { owners: [{ id: 8, percent: 100 }] },
      },
    ];
    const { data, nodes } = parseNetwork(people, companies);

    this.state = {
      chartOptions: {
        chart: { type: 'networkgraph' },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              linkFormat: '{point.custom.label}',
            },
            layoutAlgorithm: {
              attractiveForce: () => 1,
              repulsiveForce: () => 1,
              initialPositions: () => this.state.chartOptions.series[0].nodes,
            },
          },
        },
        series: [
          {
            data,
            nodes,
          },
        ],
        title: 'הון שלטון',
      },
    };
  }

  render() {
    const options = this.state.chartOptions;

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
