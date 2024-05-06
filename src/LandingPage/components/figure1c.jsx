import React, { useRef } from 'react';
import * as d3 from 'd3';

const dataset = require('./figure1c_data.json');

const figureTissueProps = require('./figureTissueProps.json');

const tissueLabels = [
  'BLOOD',
  'PLASMA',
  'HEART',
  'VENACV',
  'SPLEEN',
  'SKM-GN',
  'SKM-VL',
  'WAT-SC',
  'BAT',
  'LIVER',
  'LUNG',
  'KIDNEY',
  'ADRNL',
  'CORTEX',
  'HYPOTH',
  'HIPPOC',
  'SMLINT',
  'COLON',
  'OVARY',
  'TESTES',
];

const omeLabels = [
  'METAB',
  'IMMUNO',
  'UBIQ',
  'ACETYL',
  'PHOSPHO',
  'PROT',
  'TRNSCRPT',
  'ATAC',
  'METHYL',
];

const assayMap = {
  METAB: 'Metabolomics',
  IMMUNO: 'Immunoassays',
  UBIQ: 'Ubiquitylome',
  ACETYL: 'Acetylproteomics',
  PHOSPHO: 'Phosphoproteomics',
  PROT: 'Global proteomics',
  TRNSCRPT: 'RNA-Seq',
  ATAC: 'ATAC-seq',
  METHYL: 'RRBS',
};

const omeColors = [
  { type: 'Genomics', color: '#ff8839' },
  { type: 'Proteomics', color: '#dba0ff' },
  { type: 'Immunoassays', color: '#f9e802' },
  { type: 'Metabolomics', color: '#31fd94' },
];

/**
 * Renders landscape paper figure 1c heatmap
 *
 * @returns {Object} JSX representation of figure 1c heatmap
 */
function Figure1C() {
  const svgRef = useRef();

  function renderHeatmap() {
    // set the dimensions and margins of the graph
    const margin = { top: 0, right: 20, bottom: 100, left: 130 };
    // calc width by number of pass1b-06 tissues (20) vs each square's pixel width
    const width = 20 * 55;
    // calc height by number of omes vs each sqaure's pixel height
    const height = 9 * 55;

    // select DOM element to draw graph
    const div = d3.select(svgRef.current);
    div.selectAll('*').remove();

    // append the svg object to the selected DOM element
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = div
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'heatmap-svg')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // build X scales and axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(tissueLabels)
      .padding(0.1);

    // draw X axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).tickSize(0).tickPadding(0))
      .selectAll('text')
      .attr('transform', 'translate(-10, 8)rotate(-90)')
      .style('text-anchor', 'end')
      .style('color', '#ffffff')
      .style('font-size', '20px')
      .style('font-weight', '500')
      .select('.domain')
      .remove();

    // Remove X axis line
    svg.call(d3.axisBottom(x).tickSize(0)).select('.domain').remove();

    // build Y scales and axis
    const y = d3.scaleBand().range([height, 0]).domain(omeLabels).padding(0.1);

    // draw Y axis
    svg
      .append('g')
      .attr('class', 'heatmap-y-axis')
      .call(d3.axisLeft(y).tickSize(0).tickPadding(6))
      .style('color', '#ffffff')
      .style('font-size', '20px')
      .style('font-weight', '500')
      .select('.domain')
      .remove();

    // build color scale
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateViridis)
      .domain([0, 0.1]);

    // create a tooltip
    const tooltip = d3
      .select('#heatmap-container')
      .append('div')
      .style('display', 'none')
      .style('opacity', 0)
      .attr('class', 'heatmap-tooltip');

    // Tooltip functions
    const onMouseOver = (event, d) => {
      if (d.featureCnt !== null) {
        d3.select(event.currentTarget).attr('rx', 12).attr('ry', 12);
      }
    };
    const onMouseMove = (event, d) => {
      if (d.featureCnt !== null) {
        tooltip
          .html(
            'Tissue: ' +
              figureTissueProps[d.tissue].label +
              '<br/>Assay: ' +
              assayMap[d.ome],
          )
          .style('top', event.pageY - 280 + 'px')
          .style('left', event.pageX - 16 + 'px');
        tooltip
          .transition()
          .duration(100)
          .style('display', 'block')
          .style('opacity', 1);
        d3.select(this).style('opacity', 1);
      }
    };
    const onMouseLeave = (event, d) => {
      if (d.featureCnt !== null) {
        tooltip
          .transition()
          .duration(100)
          .style('opacity', 0)
          .style('display', 'none');
        d3.select(event.currentTarget).attr('rx', 4).attr('ry', 4);
      }
    };

    // Draw squares
    const rect = svg
      .selectAll()
      .data(dataset, (d) => d.tissue + ':' + d.ome)
      .enter();

    rect
      .append('rect')
      .attr('x', (d) => x(d.tissue))
      .attr('y', (d) => y(d.ome))
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) =>
        d.featureCnt !== null ? colorScale(d.diffProportion) : '#ffffff',
      )
      .style('stroke-width', 0)
      .style('stroke', 'none')
      .on('mouseover', onMouseOver)
      .on('mousemove', onMouseMove)
      .on('mouseleave', onMouseLeave);

    // Draw text inside squares
    rect
      .append('text')
      .attr('x', (d) => x(d.tissue) + 24) // Center text horizontally
      .attr('y', (d) => y(d.ome) + 30) // Center text vertically
      .attr('text-anchor', 'middle') // Center text horizontally
      .attr('alignment-baseline', 'middle') // Center text vertically
      .style('fill', (d) => (d.diffProportion > 0.04 ? '#000000' : '#ffffff'))
      .style('font-size', '16px')
      .style('cursor', 'default')
      .text((d) => d.featureCnt);

    // Heatmap legend with continuous gradient
    const legendMargin = { top: 15, bottom: 15, left: 20, right: 20 };
    const legendWidth = 120;
    const legendHeight = 580; // Same as heatmap height
    const legendColorScaleHeight = 340;

    // Append the svg legend to the body of the page
    const legend = div
      .append('svg')
      .attr('width', legendWidth + legendMargin.left + legendMargin.right)
      .attr('height', legendHeight + legendMargin.top + legendMargin.bottom);

    // legend color scale
    const legendColorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([0.1, 0]);

    // build legend Y scales and axis:
    const legendYAxisScale = d3
      .scaleLinear()
      .range([legendMargin.top + 260, legendHeight + 2])
      .domain(legendColorScale.domain());

    const legendYAxisRight = (g) =>
      g
        .attr('class', 'legend-y-axis')
        .attr(
          'tranform',
          `translate(${legendMargin.left + legendWidth}, ${legendMargin.top})`,
        )
        .call(
          d3
            .axisRight(legendYAxisScale)
            .ticks(5)
            .tickSize(0)
            .tickPadding(40)
            .tickFormat((i) => {
              if (i === 0.1) {
                return '0.1+';
              }
              return i;
            }),
        );

    const defs = legend.append('defs');
    // create gradient color scale in legend
    // and reverse its vertical orientation
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'heatmapGradient')
      .attr('x1', '0%') // bottom
      .attr('y1', '100%')
      .attr('x2', '0%') // to top
      .attr('y2', '0%');

    // append multiple color stops by using D3's data/enter step
    linearGradient
      .selectAll('stop')
      .data(
        legendColorScale.ticks().map((t, i, n) => ({
          offset: `${(100 * i) / n.length}%`,
          color: legendColorScale(t),
        })),
      )
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // draw the rectangle and fill with gradient color scale
    legend
      .append('g')
      .attr('transform', `translate(0, ${legendMargin.top})`)
      .append('rect')
      .attr('transform', `translate(0, 260)`)
      .attr('width', 30)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr(
        'height',
        legendColorScaleHeight - legendMargin.top - legendMargin.bottom,
      )
      .style('fill', 'url(#heatmapGradient)');

    // legend.selectAll('#heatmapGradient').attr('gradientTransform', 'rotate(0)');

    // remove Y axis line
    legend.append('g').call(legendYAxisRight).select('.domain').remove();

    // draw legend title/label
    legend
      .append('text')
      .attr('class', 'legend-title-diff-proportion')
      .attr('x', 0)
      .attr('y', legendMargin.top + 200)
      .append('tspan')
      .text('Differential')
      .append('tspan')
      .attr('x', 0)
      .attr('y', legendMargin.top + 220)
      .text('proportion')
      .append('tspan')
      .text('of analytes')
      .attr('x', 0)
      .attr('y', legendMargin.top + 240);

    // draw ome type legend title/label
    legend
      .append('text')
      .attr('class', 'legend-title-ome-type')
      .attr('x', 0)
      .attr('y', legendMargin.top + 10)
      .append('tspan')
      .text('Ome Type');

    // draw ome type legend
    const legendOmeType = legend
      .append('g')
      .attr('class', 'legend-ome-type')
      .attr('transform', `translate(0, ${legendMargin.top})`)
      .selectAll('g')
      .data(omeColors)
      .enter()
      .append('g')
      .attr(
        'transform',
        (d, i) => `translate(0, ${legendMargin.top + 10 + i * 36})`,
      );

    legendOmeType
      .append('rect')
      .attr('width', 30)
      .attr('height', 30)
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('fill', (d) => d.color);

    legendOmeType
      .append('text')
      .attr('x', 40)
      .attr('y', 20)
      .text((d) => d.type)
      .style('font-size', '16px')
      .style('font-weight', '400')
      .style('fill', '#ffffff');
  }

  return (
    <div
      ref={svgRef}
      id="heatmap-container"
      className="d-flex align-items-center justify-content-center position-relative"
    >
      {renderHeatmap()}
    </div>
  );
}

export default Figure1C;
