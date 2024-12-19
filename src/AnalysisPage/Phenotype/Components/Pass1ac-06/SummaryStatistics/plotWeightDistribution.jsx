import React, { useMemo } from 'react';
import {
  COLORS,
  defaultChartOptions,
  allBoxPlotDataByPhaseSexIntervention,
  allScatterPlotDataByPhaseSex,
} from '../sharedLib';
import Chart from '../chartWrapper';

/**
 * Renders summary statistics plots for weight disctribution
 *
 * @returns JSX representation of Highcharts plots for rat work - boxplots and scatter plots
 */
function PlotWeightDistribution() {
  // Base chart options
  const baseChartOptions = defaultChartOptions('Intervention', 'Weight', 'Weight: {point.y} grams');

  // Function to collect lactate change data for box plot
  const getWeightData = (data) => data.map((item) => parseFloat(item.weight, 10));
  const boxPlotData = useMemo(() => allBoxPlotDataByPhaseSexIntervention(getWeightData), []);

  // Scatter plot data for pass1a and pass1c (both male and female)
  const scatterData = useMemo(() => allScatterPlotDataByPhaseSex(getWeightData), []);

  // Highcharts options for the plots
  const chartOptions = useMemo(() => {
    const createChartOptions = (gender, titleText) => {
      const allData = [
        ...boxPlotData[`pass1a${gender}Acute`],
        ...boxPlotData[`pass1c${gender}Acute`],
        ...boxPlotData[`pass1a${gender}Control`],
        ...boxPlotData[`pass1c${gender}Control`],
        ...scatterData.pass1a[gender.toLowerCase()].map(([, y]) => y),
        ...scatterData.pass1c[gender.toLowerCase()].map(([, y]) => y),
      ];

      const minValue = Math.min(...allData);
      const maxValue = Math.max(...allData);
      const padding = 0.1 * (maxValue - minValue);

      return {
        ...baseChartOptions,
        title: {
          align: 'left',
          style: { fontSize: '1.5rem' },
          text: titleText,
        },
        xAxis: {
          ...baseChartOptions.xAxis,
          categories: ['Acute', 'Control'],
        },
        yAxis: {
          ...baseChartOptions.yAxis,
          min: minValue - padding,
          max: maxValue + padding,
        },
        series: [
          {
            name: 'PASS1A-06 Weight Distribution',
            type: 'boxplot',
            legendSymbol: 'areaMarker',
            data: [
              boxPlotData[`pass1a${gender}Acute`],
              boxPlotData[`pass1a${gender}Control`],
            ],
            fillColor: COLORS.pass1a.fill,
          },
          {
            name: 'PASS1C-06 Weight Distribution',
            type: 'boxplot',
            legendSymbol: 'areaMarker',
            data: [
              boxPlotData[`pass1c${gender}Acute`],
              boxPlotData[`pass1c${gender}Control`],
            ],
            fillColor: COLORS.pass1c.fill,
          },
          {
            name: 'PASS1A-06 Weight Scatter',
            type: 'scatter',
            data: scatterData.pass1a[gender.toLowerCase()],
            color: COLORS.pass1a.scatter,
            jitter: { x: 0.1 },
            showInLegend: false,
          },
          {
            name: 'PASS1C-06 Weight Scatter',
            type: 'scatter',
            data: scatterData.pass1c[gender.toLowerCase()],
            color: COLORS.pass1c.scatter,
            jitter: { x: 0.1 },
            showInLegend: false,
          },
        ],
      };
    };

    return {
      male: createChartOptions('Male', 'Distribution of WEIGHT by INTERVENTION and MALE'),
      female: createChartOptions('Female', 'Distribution of WEIGHT by INTERVENTION and FEMALE'),
    };
  }, [baseChartOptions, boxPlotData, scatterData.pass1a, scatterData.pass1c]);

  return (
    <div className="col-lg-11 h-90">
      <Chart options={chartOptions.male} className="phenotype-plot-container" />
      <Chart options={chartOptions.female} className="phenotype-plot-container" />
    </div>
  );
}

export default PlotWeightDistribution;
