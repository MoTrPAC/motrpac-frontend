import React, { useMemo } from 'react';
import {
  COLORS,
  defaultChartOptions,
  allBoxPlotDataByPhaseSexIntervention,
  allScatterPlotDataByPhaseSex,
} from '../sharedLib';
import Chart from '../chartWrapper';

/**
 * Renders summary statistics plots for lactate change
 *
 * @returns JSX representation of Highcharts plots for rat work - boxplots and scatter plots
 */
function PlotLactateChange() {
  // Base chart options
  const baseChartOptions = defaultChartOptions('Intervention', 'Lactate Change', 'Lactate Change: {point.y}');

  // Function to collect lactate change data for box plot
  const getLactateChangeData = (data) => data.map((item) => parseFloat(item.lactate_change));
  const boxPlotData = useMemo(() => allBoxPlotDataByPhaseSexIntervention(getLactateChangeData), []);

  // Scatter plot data for pass1a and pass1c (both male and female)
  const scatterData = useMemo(() => allScatterPlotDataByPhaseSex(getLactateChangeData), []);

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
            name: 'PASS1A-06 Lactate Change Distribution',
            type: 'boxplot',
            legendSymbol: 'areaMarker',
            data: [
              boxPlotData[`pass1a${gender}Acute`],
              boxPlotData[`pass1a${gender}Control`],
            ],
            fillColor: COLORS.pass1a.fill,
          },
          {
            name: 'PASS1C-06 Lactate Change Distribution',
            type: 'boxplot',
            legendSymbol: 'areaMarker',
            data: [
              boxPlotData[`pass1c${gender}Acute`],
              boxPlotData[`pass1c${gender}Control`],
            ],
            fillColor: COLORS.pass1c.fill,
          },
          {
            name: 'PASS1A-06 Scatter',
            type: 'scatter',
            data: scatterData.pass1a[gender.toLowerCase()],
            color: COLORS.pass1a.scatter,
            jitter: { x: 0.1 },
            showInLegend: false,
          },
          {
            name: 'PASS1C-06 Scatter',
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
      male: createChartOptions('Male', 'Distribution of LACTATE CHANGE by INTERVENTION and MALE'),
      female: createChartOptions('Female', 'Distribution of LACTATE CHANGE by INTERVENTION and FEMALE'),
    };
  }, [baseChartOptions, boxPlotData, scatterData]);

  return (
    <div className="col-lg-10 h-90">
      <Chart options={chartOptions.male} className="phenotype-plot-container" />
      <Chart options={chartOptions.female} className="phenotype-plot-container" />
    </div>
  );
}

export default PlotLactateChange;
