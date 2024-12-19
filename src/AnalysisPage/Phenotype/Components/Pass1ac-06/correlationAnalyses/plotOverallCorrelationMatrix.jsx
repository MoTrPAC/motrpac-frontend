import React, { useMemo, useState, useEffect } from 'react';
import * as ss from 'simple-statistics';
import {
  correlationMatrixChartOptions,
} from '../sharedLib';
import Chart from '../chartWrapper';

const pass1ac06Data = require('../../../pass1ac-animal_pheno.json');

/**
 * Renders summary statistics plots for weight disctribution
 *
 * @returns JSX representation of Highcharts plots for rat work - boxplots and scatter plots
 */
function PlotOverallCorrelationMatrix() {
  const [corrMatrixData, setCorrMatrixData] = useState(null);
  // Filter out the 'control' interventions
  const maleAcuteData = pass1ac06Data.filter((item) => item.intervention !== 'control' && item.sex === 'male');
  const femaleAcuteData = pass1ac06Data.filter((item) => item.intervention !== 'control' && item.sex === 'female');

  // Overall Correlation Matrix chart options
  function correlationData() {
    const processData = (data) => {
      return data.map((item) => {
        const { intervention, sex, pid, phase, groupi, ...rest } = item;
        const sortedKeys = Object.keys(rest).sort();
        const sortedItem = {};
        sortedKeys.forEach((key) => {
          sortedItem[key] = parseFloat(rest[key]);
        });
        return sortedItem;
      });
    };

    return {
      male: processData(maleAcuteData),
      female: processData(femaleAcuteData),
    };
  }

  useEffect(() => {
    setCorrMatrixData(correlationData());
  }, []);

  // Base chart options
  const baseChartOptions = correlationMatrixChartOptions('Variables', 'Variables', '<b>{series.xAxis.categories.(point.x)}</b> vs <b>{series.yAxis.categories.(point.y)}</b>: {point.value}');
  const filteredData = correlationData();

  // Function to produce correlation matrix data
  const generateCorrelationMatrix = (data) => {
    const variables = ['distance', 'lactate_change', 'shock_count', 'shock_duration', 'weight', 'work'];
    const matrix = [];

    const numSamples = data.length;

    for (let i = 0; i < variables.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        let correlation = 0;

        // Ensure there are enough data points and non-empty comparisons
        if (numSamples > 1) {
          const x = data.map((row) => parseFloat(row[variables[i]]));
          const y = data.map((row) => parseFloat(row[variables[j]]));

          if (x.some(isNaN) || y.some(isNaN)) {
            correlation = 0;
          } else {
            correlation = ss.sampleCorrelation(x, y) || 0; // Handle NaN cases
          }
        }
        // round correlation vlaue to 2 decimal places
        correlation = Math.round(correlation * 100) / 100;
        matrix.push([i, j, correlation]);
      }
    }

    return { matrix, variables };
  };

  // Highcharts options for the plots
  const chartOptions = useMemo(() => {
    const createChartOptions = (gender, titleText) => {
      const correlationMatrixData = generateCorrelationMatrix(filteredData[gender]);
      const { matrix, variables } = correlationMatrixData;

      return {
        ...baseChartOptions,
        title: {
          align: 'left',
          style: { fontSize: '1.5rem' },
          text: titleText,
        },
        xAxis: {
          ...baseChartOptions.xAxis,
          categories: variables,
        },
        yAxis: {
          ...baseChartOptions.yAxis,
          categories: variables,
        },
        colorAxis: {
          min: -1.0,
          max: 1.0,
          layout: 'vertical',
          tickInterval: 0.5,
          reversed: false,
          stops: [
            [0, '#1532f5'], // Correlation of -1 (bottom)
            [0.5, '#ffffff'], // No correlation (middle)
            [1, '#ea4025'], // Correlation of 1 (top)
          ],
          width: 25,
          labels: {
            format: '{value:.1f}',
          },
        },
        series: [
          {
            name: 'Correlation by key variables',
            borderWidth: 0.5,
            borderColor: '#ffffff',
            data: matrix,
            dataLabels: {
              enabled: true,
              color: '#000000',
              style: { fontSize: 9 },
            },
          },
        ],
      };
    };

    return {
      male: createChartOptions('male', 'Correlation Matrix Heatmap (male-acute)'),
      female: createChartOptions('female', 'Correlation Matrix Heatmap (female-acute)'),
    };
  }, [baseChartOptions, corrMatrixData]);

  return (
    <div className="col-lg-11 h-90">
      <Chart options={chartOptions.male} className="phenotype-plot-container" />
      <Chart options={chartOptions.female} className="phenotype-plot-container" />
    </div>
  );
}

export default PlotOverallCorrelationMatrix;
