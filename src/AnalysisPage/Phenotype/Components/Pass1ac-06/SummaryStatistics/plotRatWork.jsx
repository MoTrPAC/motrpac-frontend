import React, { useMemo } from 'react';
import {
  COLORS,
  defaultChartOptions,
  allBoxPlotDataByPhaseSexIntervention,
  allScatterPlotDataByPhaseSex,
} from '../sharedLib';
import Chart from '../chartWrapper';

/**
 * Renders summary statistics plots for rat work
 *
 * @returns JSX representation of Highcharts plots for rat work - boxplots and scatter plots
 */
function PlotRatWork() {
  // Base chart options
  const baseChartOptions = defaultChartOptions(
    'Intervention',
    'Work',
    'Work: {point.y} joules',
  );

  // Function to collect lactate change data for box plot
  const getRatWorkData = (data) =>
    data.map((item) => {
      const weight = parseInt(item.weight, 10) / 1000;
      const distance = parseInt(item.distance, 10);
      return weight * distance * 0.087 * 9.80665;
    });
  const boxPlotData = useMemo(
    () => allBoxPlotDataByPhaseSexIntervention(getRatWorkData),
    [],
  );

  // Scatter plot data for pass1a and pass1c (both male and female)
  const scatterData = useMemo(
    () => allScatterPlotDataByPhaseSex(getRatWorkData),
    [],
  );

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
            name: 'PASS1A-06 Work Distribution',
            type: 'boxplot',
            legendSymbol: 'areaMarker',
            data: [
              boxPlotData[`pass1a${gender}Acute`],
              boxPlotData[`pass1a${gender}Control`],
            ],
            fillColor: COLORS.pass1a.fill,
          },
          {
            name: 'PASS1C-06 Work Distribution',
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
      male: createChartOptions(
        'Male',
        'Distribution of WORK by INTERVENTION and MALE',
      ),
      female: createChartOptions(
        'Female',
        'Distribution of WORK by INTERVENTION and FEMALE',
      ),
    };
  }, [baseChartOptions, boxPlotData, scatterData]);

  return (
    <div className="col-lg-11 h-90">
      <Chart options={chartOptions.male} className="phenotype-plot-container" />
      <Chart
        options={chartOptions.female}
        className="phenotype-plot-container"
      />
    </div>
  );
}

export default PlotRatWork;
