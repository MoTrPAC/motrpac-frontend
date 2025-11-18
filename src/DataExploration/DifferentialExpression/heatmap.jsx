import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import figureTissueProps from './figureTissueProps.json';

import adrenalRnaSeq from '../../data/pass1b_06_dea/adrenal_rna-seq.json';
import brownAdiposeRnaSeq from '../../data/pass1b_06_dea/brown-adipose_rna-seq.json';
import colonRnaSeq from '../../data/pass1b_06_dea/colon_rna-seq.json';
import cortexRnaSeq from '../../data/pass1b_06_dea/cortex_rna-seq.json';
import gastrocRnaSeq from '../../data/pass1b_06_dea/gastrocnemius_rna-seq.json';
import heartRnaSeq from '../../data/pass1b_06_dea/heart_rna-seq.json';
import hippocRnaSeq from '../../data/pass1b_06_dea/hippocampus_rna-seq.json';
import hypothRnaSeq from '../../data/pass1b_06_dea/hypothalamus_rna-seq.json';
import kidneyRnaSeq from '../../data/pass1b_06_dea/kidney_rna-seq.json';
import liverRnaSeq from '../../data/pass1b_06_dea/liver_rna-seq.json';
import lungRnaSeq from '../../data/pass1b_06_dea/lung_rna-seq.json';
import ovaryRnaSeq from '../../data/pass1b_06_dea/ovary_rna-seq.json';
import smallIntRnaSeq from '../../data/pass1b_06_dea/small-intestine_rna-seq.json';
import spleenRnaSeq from '../../data/pass1b_06_dea/spleen_rna-seq.json';
import testesRnaSeq from '../../data/pass1b_06_dea/testis_rna-seq.json';
import vastusLatRnaSeq from '../../data/pass1b_06_dea/vastus-lateralis_rna-seq.json';
import venaCavaRnaSeq from '../../data/pass1b_06_dea/vena-cava_rna-seq.json';
import whiteAdiposeRnaSeq from '../../data/pass1b_06_dea/white-adipose_rna-seq.json';
import bloodRnaSeq from '../../data/pass1b_06_dea/whole-blood_rna-seq.json';

const pass1bTissues = [
  'Adrenal',
  'Brown Adipose',
  'Colon',
  'Cortex',
  'Gastrocnemius',
  'Heart',
  'Hippocampus',
  'Hypothalamus',
  'Kidney',
  'Liver',
  'Lung',
  'Ovary',
  'Plasma',
  'Small Intestine',
  'Spleen',
  'Testis',
  'Vastus Lateralis',
  'Vena Cava',
  'White Adipose',
  'Whole Blood',
];

function loadRnaSeqDataset(tissue) {
  switch (tissue) {
    case 'ADRNL':
      return adrenalRnaSeq;
    case 'BAT':
      return brownAdiposeRnaSeq;
    case 'COLON':
      return colonRnaSeq;
    case 'CORTEX':
      return cortexRnaSeq;
    case 'SKM-GN':
      return gastrocRnaSeq;
    case 'HEART':
      return heartRnaSeq;
    case 'HIPPOC':
      return hippocRnaSeq;
    case 'HYPOTH':
      return hypothRnaSeq;
    case 'KIDNEY':
      return kidneyRnaSeq;
    case 'LIVER':
      return liverRnaSeq;
    case 'LUNG':
      return lungRnaSeq;
    case 'OVARY':
      return ovaryRnaSeq;
    case 'SMLINT':
      return smallIntRnaSeq;
    case 'SPLEEN':
      return spleenRnaSeq;
    case 'TESTES':
      return testesRnaSeq;
    case 'SKM-VL':
      return vastusLatRnaSeq;
    case 'VENACV':
      return venaCavaRnaSeq;
    case 'WAT-SC':
      return whiteAdiposeRnaSeq;
    case 'BLOOD':
      return bloodRnaSeq;
    default:
      return [];
  }
}

/**
 * Renders the heatmap of top 50 DE genes by tissue/assay
 * in pass1b-06 rat training data
 *
 * @param {String} tissue Tissue abbreviation
 * @param {String} assay  Assay
 *
 * @returns {Object} JSX representation of the htop 50 DE genes heatmap
 */
function Heatmap({ tissue = '', assay = '' }) {
  const modalRef = useRef();

  let dataset = [];
  const top50GeneSymbols = [];
  if (assay && assay.length && assay === 'rna-seq') {
    dataset = [...loadRnaSeqDataset(tissue)];
  }

  if (dataset.length) {
    dataset.forEach((item) => {
      if (item.tissue_abbreviation === tissue) {
        top50GeneSymbols.push(item.gene_symbol);
      }
    });
  }

  function renderHeatmap() {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 75, left: 145 };
    // calc width by number of pass1b-06 tissues (20) vs each square's pixel width
    const width = 20 * 41;
    // calc height by number of top DE genes (50) vs each sqaure's pixel height
    const height = 50 * 15;

    // select DOM element to draw graph
    const div = d3.select(modalRef.current);
    div.selectAll('*').remove();

    // append the svg object to the body of the page
    const svg = div
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Build X scales and axis:
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(pass1bTissues)
      .padding(0.15);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).tickSize(0).tickPadding(5))
      .selectAll('text')
      .attr('transform', 'translate(-5, 8)rotate(-35)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', (d) =>
        d.indexOf(figureTissueProps[tissue].label) > -1 ? '700' : '400',
      );

    svg.call(d3.axisBottom(x).tickSize(0)).select('.domain').remove();

    // Build X scales and axis:
    const y = d3
      .scaleBand()
      .range([height, 0])
      .domain(top50GeneSymbols)
      .padding(0.15);

    svg
      .append('g')
      .call(d3.axisLeft(y).tickSize(0).tickPadding(8))
      .style('font-size', '12px')
      .select('.domain')
      .remove();

    // Build color scale
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateGnBu)
      .domain([0.1, 0]);

    // create a tooltip
    const tooltip = d3
      .select(modalRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'heatmap-tooltip');

    const getGeneValue = (value) => {
      return value || '--';
    };

    // Tooltip functions
    const mouseover = (event, d) => {
      const [xPos, yPos] = d3.pointer(event);
      tooltip
        .html(
          'Tissue: ' +
            d.tissue_label +
            '<br/>Adj p-value: ' +
            d.adj_p_value +
            '<br/>Human Gene Symbol: ' +
            getGeneValue(d.human_gene_symbol) +
            '<br/>Entrez Gene ID: ' +
            getGeneValue(d.entrez_gene),
        )
        .style('top', yPos - y.bandwidth() * 4 + 'px')
        .style('left', xPos + margin.left + x.bandwidth() + 'px');
      tooltip.transition().duration(300).style('opacity', 1);
      d3.select(this).style('opacity', 1);
    };
    const mousemove = (event, d) => {
      const [xPos, yPos] = d3.pointer(event);
      tooltip
        .html(
          'Tissue: ' +
            d.tissue_label +
            '<br/>Adj p-value: ' +
            d.adj_p_value +
            '<br/>Human Gene Symbol: ' +
            getGeneValue(d.human_gene_symbol) +
            '<br/>Entrez Gene ID: ' +
            getGeneValue(d.entrez_gene),
        )
        .style('top', yPos - y.bandwidth() * 4 + 'px')
        .style('left', xPos + margin.left + x.bandwidth() + 'px');
    };
    const mouseleave = (d) => {
      tooltip.transition().duration(500).style('opacity', 0);
    };

    // Draw squares
    svg
      .selectAll()
      .data(dataset, (d) => d.tissue_label + ':' + d.gene_symbol)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.tissue_label))
      .attr('y', (d) => y(d.gene_symbol))
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => colorScale(d.adj_p_value))
      .style('stroke-width', 4)
      .style('stroke', 'none')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);

    // Heatmap legend with continuous gradient
    const legendMargin = { top: 30, bottom: 75, left: 30, right: 20 };
    const legendWidth = 20;
    const legendHeight = height; // Same as heatmap height

    // Append the svg legend to the body of the page
    const legend = div
      .append('svg')
      .attr('width', legendWidth + legendMargin.left + legendMargin.right)
      .attr('height', legendHeight + legendMargin.top + legendMargin.bottom);

    // Legend color scale
    const legendColorScale = d3
      .scaleSequential(d3.interpolateGnBu)
      .domain([0.1, 0]);

    // Build X scales and axis:
    const legendYAxisScale = d3
      .scaleLinear()
      .range([legendMargin.top, legendHeight + legendMargin.top])
      .domain(legendColorScale.domain());

    const legendYAxisRight = (g) =>
      g
        .attr('class', 'legend-y-axis')
        .attr(
          'tranform',
          `translate(${legendMargin.left + legendWidth}, ${legendMargin.top})`,
        )
        .call(
          d3.axisRight(legendYAxisScale).ticks(10).tickSize(0).tickPadding(25),
        );

    const defs = legend.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'heatmapGradient');
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

    legend
      .append('g')
      .attr('transform', `translate(0, ${legendMargin.top})`)
      .append('rect')
      .attr('transform', `translate(0, 0)`)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#heatmapGradient)');

    legend
      .selectAll('#heatmapGradient')
      .attr('gradientTransform', 'rotate(90)');

    legend.append('g').call(legendYAxisRight).select('.domain').remove();

    // Draw legend title/label
    legend
      .append('text')
      .attr('class', 'heatmap-legend-title')
      .attr('x', 0)
      .attr('y', legendHeight + legendMargin.top + 25)
      .append('tspan')
      .text('Adjusted')
      .append('tspan')
      .text('p-value')
      .attr('x', 0)
      .attr('y', legendHeight + legendMargin.top + 40);
  }

  useEffect(() => {
    if (dataset.length) {
      renderHeatmap();
    }
  }, [tissue]);

  return (
    <div
      ref={modalRef}
      id="de-genes-heatmap-container"
      className="d-flex align-items-center justify-content-center"
    />
  );
}

Heatmap.propTypes = {
  tissue: PropTypes.string,
  assay: PropTypes.string,
};

export default Heatmap;
