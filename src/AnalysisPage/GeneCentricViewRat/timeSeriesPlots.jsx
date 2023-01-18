import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryErrorBar,
  VictoryAxis,
} from 'victory';
import { geneSearchTimewisePlotPropType } from './sharedlib';
import { tissueList, assayList } from '../../lib/searchFilters';
import roundNumbers from '../../lib/utils/roundNumbers';
import colors from '../../lib/colors';

/**
 * Renders time series line plots for gene-centric search results
 * @param {array} plotData Timewise DEA results for a gene
 * @param {array} selectedFeatures Selected features to plot
 * @returns One or more line plots
 */
function TimeSeriesPlots({ plotData, selectedFeatures }) {
  // Convert tissue value from raw data to display value
  function transformTissueName(tissueName) {
    const match = tissueList.find(
      (filter) => filter.filter_value === tissueName
    );
    return match ? match.filter_label : tissueName;
  }

  // Convert assay value from raw data to display value
  function transformAssayName(assayName) {
    const match = assayList.find((filter) => filter.filter_value === assayName);
    return match ? match.filter_label : assayName;
  }

  // FIXME: This function needs to be simplified and modularized
  // Renders line plot using timewise data for female and male per gene, tissue, ome
  function getMatchingPlotData(feature) {
    // Find matching female plot data for the selected feature
    const matchedRowsFemale = plotData.filter((row) => {
      return (
        row.feature_ID === feature.featureId &&
        row.sex === 'female' &&
        transformTissueName(row.tissue) === feature.tissue &&
        transformAssayName(row.assay) === feature.assay
      );
    });

    // Find matching male plot data for the selected feature
    const matchedRowsMale = plotData.filter((row) => {
      return (
        row.feature_ID === feature.featureId &&
        row.sex === 'male' &&
        transformTissueName(row.tissue) === feature.tissue &&
        transformAssayName(row.assay) === feature.assay
      );
    });

    // Compute logFC value range (min, max)
    function computeRange(data) {
      const min = Math.min(...data.map((row) => row.logFC));
      const max = Math.max(...data.map((row) => row.logFC));
      return [min - 0.15, max + 0.15];
    }

    // Construct plot data sets in array
    function buildDataSet(rawData) {
      const sortedRawData = rawData.sort((a, b) => {
        return (
          a.comparison_group.substring(0, 1) -
          b.comparison_group.substring(0, 1)
        );
      });
      const arr = [{ x: 0, y: 0 }];
      sortedRawData.forEach((row) => {
        arr.push({
          x: Number(row.comparison_group.slice(0, 1)),
          y: roundNumbers(row.logFC, 4),
        });
      });
      return arr;
    }

    // Construct plot data sets in array (for error bars)
    function buildErrorDataSet(rawData) {
      const sortedRawData = rawData.sort((a, b) => {
        return (
          a.comparison_group.substring(0, 1) -
          b.comparison_group.substring(0, 1)
        );
      });
      const arr = [{ x: 0, y: 0, errorY: 0 }];
      sortedRawData.forEach((row) => {
        arr.push({
          x: Number(row.comparison_group.slice(0, 1)),
          y: roundNumbers(row.logFC, 4),
          errorY: roundNumbers(row.logFC_se, 4) * 2,
        });
      });
      return arr;
    }

    return (
      <div className="d-flex align-items-center justify-content-center mb-4">
        {matchedRowsFemale ? (
          <div
            key={`${feature.featureId}-${feature.tissue}-${feature.assay}-female`}
            className="mr-2"
          >
            <VictoryChart
              height={300}
              padding={{ top: 20, bottom: 35, left: 45, right: 20 }}
            >
              <VictoryLine
                animate={{
                  duration: 400,
                  onLoad: { duration: 200 },
                }}
                data={buildDataSet(matchedRowsFemale)}
                domain={{ y: computeRange(matchedRowsFemale) }}
                style={{
                  data: {
                    stroke: colors.gender.female,
                  },
                }}
              />
              <VictoryScatter
                animate={{
                  duration: 400,
                  onLoad: { duration: 200 },
                }}
                data={buildDataSet(matchedRowsFemale)}
                domain={{ y: computeRange(matchedRowsFemale) }}
                size={5}
                style={{
                  data: {
                    fill: colors.gender.female,
                  },
                }}
              />
              <VictoryErrorBar
                animate={{
                  duration: 400,
                  onLoad: { duration: 200 },
                }}
                data={buildErrorDataSet(matchedRowsFemale)}
                style={{
                  data: {
                    stroke: colors.gender.female,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="logFC"
                style={{
                  axisLabel: { fontSize: 13, padding: 30 },
                  grid: {
                    stroke: ({ tick }) => (tick === 0 ? '#ddd' : 'transparent'),
                  },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: { fontSize: 9, padding: 2 },
                }}
              />
              <VictoryAxis
                crossAxis
                label="Time trained (weeks)"
                offsetY={35}
                orientation="bottom"
                style={{
                  axisLabel: { padding: 20 },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: { fontSize: 9, padding: 2 },
                }}
                tickValues={[0, 1, 2, 4, 8]}
              />
            </VictoryChart>
          </div>
        ) : null}
        {matchedRowsMale ? (
          <div
            key={`${feature.featureId}-${feature.tissue}-${feature.assay}-male`}
            className="ml-2"
          >
            <VictoryChart
              height={300}
              padding={{ top: 20, bottom: 35, left: 45, right: 20 }}
            >
              <VictoryLine
                animate={{
                  duration: 400,
                  onLoad: { duration: 200 },
                }}
                data={buildDataSet(matchedRowsMale)}
                domain={{ y: computeRange(matchedRowsMale) }}
                style={{
                  data: {
                    stroke: colors.gender.male,
                  },
                }}
              />
              <VictoryScatter
                animate={{
                  duration: 400,
                  onLoad: { duration: 200 },
                }}
                data={buildDataSet(matchedRowsMale)}
                domain={{ y: computeRange(matchedRowsMale) }}
                size={5}
                style={{
                  data: {
                    fill: colors.gender.male,
                  },
                }}
              />
              <VictoryErrorBar
                animate={{
                  duration: 400,
                  onLoad: { duration: 200 },
                }}
                data={buildErrorDataSet(matchedRowsMale)}
                style={{
                  data: {
                    stroke: colors.gender.male,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="logFC"
                style={{
                  axisLabel: { fontSize: 13, padding: 30 },
                  grid: {
                    stroke: ({ tick }) => (tick === 0 ? '#ddd' : 'transparent'),
                  },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: { fontSize: 9, padding: 2 },
                }}
              />
              <VictoryAxis
                crossAxis
                label="Time trained (weeks)"
                offsetY={35}
                orientation="bottom"
                style={{
                  axisLabel: { padding: 20 },
                  ticks: { stroke: '#000', size: 5 },
                  tickLabels: { fontSize: 9, padding: 2 },
                }}
                tickValues={[0, 1, 2, 4, 8]}
              />
            </VictoryChart>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      id="gene-centric-time-series-plots-container"
      className="gene-centric-time-series-plots-container"
    >
      {selectedFeatures.slice(0, 9).map((feature) => (
        <div key={`${feature.featureId}-${feature.tissue}-${feature.assay}`}>
          <div className="d-flex align-items-center justify-content-center">
            <div className="font-weight-bold plot-header">
              {`${feature.gene_symbol.toUpperCase()}, ${feature.tissue}, ${feature.assay} (P-value: ${feature.p_value})`}
            </div>
            <div className="plot-lengend d-flex align-items-center ml-3">
              <span className="material-icons legend-icon female mr-1">
                circle
              </span>
              <span className="legend-text mr-2">Female</span>
              <span className="material-icons legend-icon male mr-1">
                circle
              </span>
              <span className="legend-text">Male</span>
            </div>
          </div>
          {getMatchingPlotData(feature)}
        </div>
      ))}
    </div>
  );
}

TimeSeriesPlots.propTypes = {
  plotData: PropTypes.arrayOf(
    PropTypes.shape({ ...geneSearchTimewisePlotPropType })
  ).isRequired,
  selectedFeatures: PropTypes.arrayOf(
    PropTypes.shape({
      featureId: PropTypes.string,
      tissue: PropTypes.string,
      assay: PropTypes.string,
      gene_symbol: PropTypes.string,
      p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default TimeSeriesPlots;
