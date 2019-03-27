import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dataAcuteTest from '../data/RLS0.01_1A.6M_DS_MoTrPAC.PASS_Animal.Acute.Test.csv';
import dataRegistration from '../data/RLS0.01_1A.6M_DS_MoTrPAC.PASS_Animal.Registration.csv';
import dataFamiliarization from '../data/RLS0.01_1A.6M_DS_MoTrPAC.PASS_Animal.Familiarization.csv';

/**
 * Dictionary
 */
const plot = {
  distribution: {
    distance: 'Distribution of Distances',
    fat: 'Distribution of Body Fat',
    weight: 'Distribution of Body Weight',
  },
  median: {
    distanceBySex: 'Males vs. Females in Distances',
  },
  correlation: {
    weightVsFat: 'Weight vs. Fat',
  },
};

/**
 * Functional component to render animal phenotype acute test data visualization
 * It uses internal states not shared by other components
 *
 * @return {Object} JSX representation of the animal phenotype data visualization
 */
function AnimalPhenotypeDataAcuteTest() {
  // Local states
  const [graph, setGraph] = useState('histogram');
  const [graphTitle, setGraphTitle] = useState('Distribution of Distances');
  const [btnStates, setBtnStates] = useState({ histogram: 'active', boxplot: '', scatterplot: '' });
  const [historgramData, setHistogramData] = useState('Distance');

  const ref = useRef(null);

  const margin = {
    top: 10,
    bottom: 30,
    left: 30,
    right: 40,
  };
  const width = 960;
  const height = 500;

  // Utility function to erform a numeric sort on an array
  function sortNumber(a, b) {
    return a - b;
  }

  // Function to render histogram/distribution
  function renderHistogram() {
    d3.csv(dataAcuteTest).then((array) => {
      const data = [];

      // extract data into new array (e.g. distance, fat, weight)
      array.forEach((obj) => {
        if (historgramData === 'Distance') {
          if (obj.distance && obj.distance.length) {
            data.push(+obj.distance);
          }
        } else if (historgramData === 'Weight') {
          if (obj.weight && obj.weight.length) {
            data.push(+obj.weight);
          }
        }
      });

      // scale the range of the data in the x domain
      const x = d3.scaleLinear()
        .domain(d3.extent(data)).nice()
        .range([margin.left, width - margin.right]);

      // invoke d3.js histogram to set up structure
      const bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(50))(data);

      // scale the range of the data in the y domain
      const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height - margin.bottom, margin.top]);

      // select DOM element to draw graph
      const group = d3.select(ref.current);
      group.selectAll('*').remove();

      // bind data
      const groupWithData = group.selectAll('rect').data(bins);

      // clean up
      groupWithData.exit().remove();

      // draw each rect in graph
      groupWithData
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.x0) + 1)
        .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .transition()
        .delay((d, i) => i * 10)
        .duration(100)
        .attr('y', d => y(d.length))
        .attr('height', d => y(0) - y(d.length));

      // add x axis
      group.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // text label for x axis
      group.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.top + 5})`)
        .style('text-anchor', 'middle')
        .text(historgramData);

      // add y axis
      group.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      // text label for y axis
      group.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Frequency');
    }).catch((err) => {
      throw err;
    });
  }

  // Function to render boxplot
  function renderBoxplot() {
    Promise.all([
      d3.csv(dataAcuteTest),
      d3.csv(dataRegistration),
    ]).then((allData) => {
      const acuteTestData = allData[0];
      const registrationData = allData[1];
      const groupDistanceData = { Male: [], Female: [] };
      const distanceRangeData = [];
      const boxWidth = 100;

      function boxQuartiles(d) {
        return [
          d3.quantile(d, 0.25),
          d3.quantile(d, 0.5),
          d3.quantile(d, 0.75),
        ];
      }

      // extract acute test data into new array of objects (e.g. pid, distance)
      const distanceData = acuteTestData.filter((obj) => {
        return obj.distance && obj.distance.length;
      }).map((obj) => {
        return {
          pid: obj.pid,
          distance: +obj.distance,
        };
      });

      // extract registration data into new array of objects (e.g. pid, sex)
      const sexData = registrationData.filter((obj) => {
        return obj.sex && obj.sex.length;
      }).map((obj) => {
        return {
          pid: obj.pid,
          sex: +obj.sex,
        };
      });

      // map distance data to sex data by pid
      const mappedData = distanceData
        .map(x => Object.assign(x, sexData.find(y => y.pid === x.pid)));

      // extract data into separate arrays (e.g. male, female)
      // female = 1, male = 2
      mappedData.forEach((obj) => {
        if (obj.sex === 2) {
          groupDistanceData.Male.push(obj.distance);
          groupDistanceData.Male.sort(sortNumber);
        } else {
          groupDistanceData.Female.push(obj.distance);
          groupDistanceData.Female.sort(sortNumber);
        }
        // also create array of all distances for y scale
        distanceRangeData.push(obj.distance);
        distanceRangeData.sort(sortNumber);
      });

      // setup a color scale for filling each box
      const colorScale = d3.scaleOrdinal(d3.schemeAccent)
        .domain(Object.keys(distanceRangeData));

      // prep data for box plot
      const boxPlotData = [];
      Object.entries(groupDistanceData).forEach(([key, distance]) => {
        let record = {};
        const localMin = d3.min(distance);
        const localMax = d3.max(distance);

        record = {
          key,
          counts: distance,
          quartile: boxQuartiles(distance),
          whiskers: [localMin, localMax],
          color: colorScale(key),
        };

        boxPlotData.push(record);
      });

      // Ccompute an ordinal xScale for the keys in boxPlotData
      const x = d3.scalePoint()
        .domain(Object.keys(groupDistanceData))
        .rangeRound([margin.left, width - margin.right])
        .padding([0.75]);

      // Compute a global y scale based on the global counts
      const min = d3.min(distanceRangeData);
      const max = d3.max(distanceRangeData);
      const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - margin.bottom, margin.top]);

      // select DOM element to draw graph
      const group = d3.select(ref.current);
      group.selectAll('*').remove();

      // bind data
      const verticalLinesData = group.selectAll('.verticalLines').data(boxPlotData);
      const rectsData = group.selectAll('rect').data(boxPlotData);
      const whiskersData = group.selectAll('.whiskers').data(boxPlotData);

      // clean up
      verticalLinesData.exit().remove();
      rectsData.exit().remove();
      whiskersData.exit().remove();

      // draw boxplot vertical lines
      verticalLinesData
        .enter()
        .append('line')
        .attr('x1', d => x(d.key))
        .attr('y1', d => y(d.whiskers[0]))
        .attr('x2', d => x(d.key))
        .attr('y2', d => y(d.whiskers[1]))
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

      // Draw the boxes of the box plot, filled in white and on top of vertical lines
      rectsData
        .enter()
        .append('rect')
        .attr('width', boxWidth)
        .attr('height', d => y(d.quartile[0]) - y(d.quartile[2]))
        .attr('x', d => x(d.key) - (boxWidth / 2))
        .attr('y', d => y(d.quartile[2]))
        .attr('fill', d => d.color)
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

      // Now render all the horizontal lines at once - the whiskers and the median
      const horizontalLineConfigs = [
        // top whisker
        {
          x1: d => x(d.key) - (boxWidth / 2),
          y1: d => y(d.whiskers[0]),
          x2: d => x(d.key) + (boxWidth / 2),
          y2: d => y(d.whiskers[0]),
        },
        // median line
        {
          x1: d => x(d.key) - (boxWidth / 2),
          y1: d => y(d.quartile[1]),
          x2: d => x(d.key) + (boxWidth / 2),
          y2: d => y(d.quartile[1]),
        },
        // bottom whisker
        {
          x1: d => x(d.key) - (boxWidth / 2),
          y1: d => y(d.whiskers[1]),
          x2: d => x(d.key) + (boxWidth / 2),
          y2: d => y(d.whiskers[1]),
        },
      ];

      horizontalLineConfigs.forEach((lineConfig) => {
        whiskersData
          .enter()
          .append('line')
          .attr('x1', lineConfig.x1)
          .attr('y1', lineConfig.y1)
          .attr('x2', lineConfig.x2)
          .attr('y2', lineConfig.y2)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('fill', 'none');
      });

      // add x axis
      group.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // text label for x axis
      group.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.top + 5})`)
        .style('text-anchor', 'middle')
        .text('Males vs. Females');

      // add y axis
      group.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      // text label for y axis
      group.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Distance');
    }).catch((err) => {
      throw err;
    });
  }

  // Function to render scatterplot
  function renderScatterplot() {
    Promise.all([
      d3.csv(dataFamiliarization),
      d3.csv(dataRegistration),
    ]).then((allData) => {
      const familiarizationData = allData[0];
      const registrationData = allData[1];

      // extract familiarization data into new array of objects (e.g. pid, weight, fat)
      const weightFatData = familiarizationData.filter((obj) => {
        return obj.weight && obj.weight.length && obj.fat && obj.fat.length;
      }).map((obj) => {
        return {
          pid: obj.pid,
          weight: +obj.weight,
          fat: +obj.fat,
        };
      });

      // extract registration data into new array of objects (e.g. pid, sex)
      const sexData = registrationData.filter((obj) => {
        return obj.sex && obj.sex.length;
      }).map((obj) => {
        return {
          pid: obj.pid,
          sex: +obj.sex === 2 ? 'Male' : 'Female',
        };
      });

      // map distance data to sex data by pid
      const mappedData = weightFatData
        .map(x => Object.assign(x, sexData.find(y => y.pid === x.pid)));

      // setup a color scale for filling each dot
      const colorScale = d3.scaleOrdinal(d3.schemeAccent);
      const colorValue = d => d.sex;

      // compute linear x scale based on weight range
      const x = d3.scaleLinear()
        .domain(d3.extent(mappedData, d => d.weight)).nice()
        .range([margin.left, width - margin.right]);

      // compute linear y scale based on fat range
      const y = d3.scaleLinear()
        .domain(d3.extent(mappedData, d => d.fat)).nice()
        .range([height - margin.bottom, margin.top]);

      // add the tooltip area to the webpage
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      // select DOM element to draw graph
      const group = d3.select(ref.current);
      group.selectAll('*').remove();

      // bind data
      const groupWithData = group.selectAll('circle').data(mappedData);

      // clean up
      groupWithData.exit().remove();

      // draw dots
      groupWithData
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        .attr('cx', d => x(d.weight))
        .attr('cy', d => y(d.fat))
        .attr('fill', d => colorScale(colorValue(d)))
        .on('mouseover', (d) => {
          tooltip
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          tooltip
            .html(`Weight: ${d.weight}; Fat: ${d.fat}`)
            .style('left', `${d3.event.pageX + 5}px`)
            .style('top', `${d3.event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
        });

      // add x axis
      group.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // text label for x axis
      group.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.top + 5})`)
        .style('text-anchor', 'middle')
        .text('Weight');

      // add y axis
      group.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      // text label for y axis
      group.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Fat');

      // draw legend
      const legend = group.selectAll('.legend')
        .data(colorScale.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${i * 30})`);

      // draw legend colored rectangles
      legend.append('rect')
        .attr('x', width - 18)
        .attr('y', 9)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', colorScale);

      // draw legend text
      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.875rem')
        .style('text-anchor', 'end')
        .text(d => d);
    }).catch((err) => {
      throw err;
    });
  }

  // Render graph using hooks equivalent to
  // componentDidMount and componentDidUpdate
  useEffect(
    () => {
      switch (graph) {
        case 'boxplot':
          return renderBoxplot();
        case 'scatterplot':
          return renderScatterplot();
        default:
          return renderHistogram();
      }
    },
  );

  // Function to handle button click event
  function handleClick(arg, e) {
    e.preventDefault(); e.stopPropagation();
    switch (arg) {
      case 'boxplot':
        setGraph(arg);
        setGraphTitle(plot.median.distanceBySex);
        setBtnStates({ histogram: '', boxplot: 'active', scatterplot: '' });
        return;
      case 'scatterplot':
        setGraph(arg);
        setGraphTitle(plot.correlation.weightVsFat);
        setBtnStates({ histogram: '', boxplot: '', scatterplot: 'active' });
        return;
      default:
        setGraph('histogram');
        setGraphTitle(plot.distribution.distance);
        setBtnStates({ histogram: 'active', boxplot: '', scatterplot: '' });
    }
  }

  // Function to handle button click event
  // for switching between distance and weight distribution
  function handleDataChange(arg, e) {
    e.preventDefault(); e.stopPropagation();
    switch (arg) {
      case 'Weight':
        setHistogramData(arg);
        setGraphTitle(plot.distribution.weight);
        return;
      default:
        setHistogramData('Distance');
        setGraphTitle(plot.distribution.distance);
    }
  }

  return (
    <div className="animal-phenotype-data-acute-test">
      <div className="card">
        <h5 className="card-header">Phenotypic Data Acute Test</h5>
        <div className="card-body">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
            <div className="graph-title">
              <h5 className="card-title">{graphTitle}</h5>
            </div>
            <div className="btn-toolbar">
              <div className="btn-group">
                <button
                  className={`btn btn-sm btn-outline-primary ${btnStates.histogram}`}
                  type="button"
                  onClick={handleClick.bind(this, 'histogram')}
                >
                    Histogram
                </button>
                <button
                  className={`btn btn-sm btn-outline-primary ${btnStates.boxplot}`}
                  type="button"
                  onClick={handleClick.bind(this, 'boxplot')}
                >
                  Boxplot
                </button>
                <button
                  className={`btn btn-sm btn-outline-primary ${btnStates.scatterplot}`}
                  type="button"
                  onClick={handleClick.bind(this, 'scatterplot')}
                >
                  Scatterplot
                </button>
              </div>
            </div>
          </div>
          <div className="graph-svg-container d-flex align-items-center" id="graph-svg-container">
            <svg className="graph-svg-content flex-grow-1" width="960" height="530">
              <g
                ref={ref}
                transform={`translate(${margin.left}, ${margin.top})`}
              />
            </svg>
            {graph === 'histogram' && (
              <div className="histogram-options">
                <div className="btn-group-vertical">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    onClick={handleDataChange.bind(this, 'Distance')}
                  >
                    Distance
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    onClick={handleDataChange.bind(this, 'Weight')}
                  >
                    Weight
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimalPhenotypeDataAcuteTest;
