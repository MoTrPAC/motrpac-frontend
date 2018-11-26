import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

export function countUploads(data) {
  const counts = Object.create(null);
  data.forEach((point) => {
    counts[point] = counts[point] ? counts[point] + 1 : 1;
  });
  return counts;
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function previousUploadsGraph({ previousUploads }) {
  const dataCount = countUploads(previousUploads.map(upload => upload.type));
  const data = Object.keys(dataCount).map(key => ({ dataType: key, dataCount: dataCount[key] }));
  return (
    <div className="col-12 col-md-6">
      <VictoryChart domainPadding={30}>
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={range(data.length, 1)}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          label="# of Uploads"
          style={{
            axis: { stroke: 'none' },
          }}
        />
        <VictoryBar
          data={data}
          x="dataType"
          y="dataCount"
          style={{
            data: { fill: '#11397E' },
          }}
        />
      </VictoryChart>
    </div>
  );
}

export default previousUploadsGraph;
