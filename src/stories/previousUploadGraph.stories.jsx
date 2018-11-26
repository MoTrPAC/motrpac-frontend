import React from 'react';
import { storiesOf } from '@storybook/react';
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import Plot from 'react-plotly.js';
import { BarChart, Bar, XAxis as RCxaxis, YAxis as RCyaxis } from 'recharts';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PreviousUploadsGraph, { countUploads } from '../components/previousUploadsGraph';

const previousUploads = require('../testData/testPreviousUploads');

const dataCount = countUploads(previousUploads.map(upload => upload.type));

function ReactVisUploadsGraph() {
  const data = Object.keys(dataCount).map(key => ({ x: key, y: dataCount[key] }));
  return (
    <div>
      <XYPlot xType="ordinal" width={400} height={250}>
        <VerticalBarSeries data={data} />
        <XAxis />
        <YAxis />
      </XYPlot>
    </div>
  );
}
function PlotlyUploadsGraph() {
  return (
    <Plot
      data={[
        {
          type: 'histogram',
          x: previousUploads.map(upload => upload.type),
          marker: { color: '#11397E' },
        },
      ]}
    />
  );
}
function ReChartsUploadsGraph() {
  const data = Object.keys(dataCount).map(key => ({ name: key, value: dataCount[key] }));
  return (
    <BarChart width={600} height={300} data={data}>
      <Bar dataKey="value" fill="#11397E" />
      <RCxaxis dataKey="name" />
      <RCyaxis label={{ value: '# of Uploads', angle: -90 }} />
    </BarChart>
  );
}

function HighChartsUploadsGraph() {
  const datas = Object.keys(dataCount).map(key => ({ name: key, y: dataCount[key] }));
  const options = {
    title: '',
    series: [{
      type: 'column',
      name: 'Uploaded Files',
      data: datas,
      color: '#11397E',
    }],
    xAxis: {
      categories: Object.keys(dataCount),
    },
    yAxis: {
      title: { text: '# of Uploads' },
    },
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}
storiesOf('Previous Uploads Graph', module)
  .add('Victory', () => <PreviousUploadsGraph previousUploads={previousUploads} />)
  .add('React-Vis', () => <ReactVisUploadsGraph />)
  .add('Plotly', () => <PlotlyUploadsGraph />)
  .add('ReCharts', () => <ReChartsUploadsGraph />)
  .add('HighCharts', () => <HighChartsUploadsGraph />);
