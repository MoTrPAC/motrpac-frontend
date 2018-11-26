import React from 'react';
import { storiesOf } from '@storybook/react';
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import Plot from 'react-plotly.js';
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

storiesOf('Previous Uploads Graph', module)
  .add('Victory', () => <PreviousUploadsGraph previousUploads={previousUploads} />)
  .add('React-Vis', () => <ReactVisUploadsGraph />)
  .add('Plotly', () => <PlotlyUploadsGraph />);
