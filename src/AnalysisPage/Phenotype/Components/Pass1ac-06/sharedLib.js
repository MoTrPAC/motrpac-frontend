import pass1ac06Data from '../../pass1ac-animal_pheno.json';

// male data
export const pass1aMaleAcute = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1a' &&
    item.sex === 'male' &&
    item.intervention === 'acute',
);
export const pass1aMaleControl = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1a' &&
    item.sex === 'male' &&
    item.intervention === 'control',
);
export const pass1cMaleAcute = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1c' &&
    item.sex === 'male' &&
    item.intervention === 'acute',
);
export const pass1cMaleControl = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1c' &&
    item.sex === 'male' &&
    item.intervention === 'control',
);

// female data
export const pass1aFemaleAcute = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1a' &&
    item.sex === 'female' &&
    item.intervention === 'acute',
);
export const pass1aFemaleControl = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1a' &&
    item.sex === 'female' &&
    item.intervention === 'control',
);
export const pass1cFemaleAcute = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1c' &&
    item.sex === 'female' &&
    item.intervention === 'acute',
);
export const pass1cFemaleControl = pass1ac06Data.filter(
  (item) =>
    item.phase === 'pass1c' &&
    item.sex === 'female' &&
    item.intervention === 'control',
);

// Function to calculate box plot data
function calculateBoxPlotData(rawData, processData) {
  const boxPlotData = processData(rawData).sort((a, b) => a - b);
  const len = boxPlotData.length;
  return [
    boxPlotData[0], // min
    boxPlotData[Math.round(len * 0.25)], // q1
    boxPlotData[Math.round(len * 0.5)], // median
    boxPlotData[Math.round(len * 0.75)], // q3
    boxPlotData[len - 1], // max
  ];
}

// Function to get all box plot data by phase, sex, and intervention
export function allBoxPlotDataByPhaseSexIntervention(processData) {
  return {
    pass1aMaleAcute: calculateBoxPlotData(pass1aMaleAcute, processData),
    pass1aMaleControl: calculateBoxPlotData(pass1aMaleControl, processData),
    pass1cMaleAcute: calculateBoxPlotData(pass1cMaleAcute, processData),
    pass1cMaleControl: calculateBoxPlotData(pass1cMaleControl, processData),
    pass1aFemaleAcute: calculateBoxPlotData(pass1aFemaleAcute, processData),
    pass1aFemaleControl: calculateBoxPlotData(pass1aFemaleControl, processData),
    pass1cFemaleAcute: calculateBoxPlotData(pass1cFemaleAcute, processData),
    pass1cFemaleControl: calculateBoxPlotData(pass1cFemaleControl, processData),
  };
}

// Function to get all scatter plot data by phase, sex, and intervention
export function allScatterPlotDataByPhaseSex(processData) {
  const getScatterPlots = (acuteData, controlData) => [
    processData(acuteData),
    processData(controlData),
  ];

  const createScatterData = (acuteData, controlData, offset) =>
    getScatterPlots(acuteData, controlData).reduce(
      (acc, data, x) =>
        acc.concat(
          data.map((value) => [x + offset, Math.round(value * 1000) / 1000]),
        ),
      [],
    );

  return {
    pass1a: {
      male: createScatterData(pass1aMaleAcute, pass1aMaleControl, -0.15),
      female: createScatterData(pass1aFemaleAcute, pass1aFemaleControl, -0.15),
    },
    pass1c: {
      male: createScatterData(pass1cMaleAcute, pass1cMaleControl, 0.15),
      female: createScatterData(pass1cFemaleAcute, pass1cFemaleControl, 0.15),
    },
  };
}

// Color constants
export const COLORS = {
  pass1a: {
    fill: '#f9aeac',
    scatter: '#84191b',
  },
  pass1c: {
    fill: '#8ad9db',
    scatter: '#191985',
  },
};

// Default chart options
export function defaultChartOptions(
  xAxisTitle,
  yAxisTitle,
  scatterTooltipFormat,
) {
  return {
    xAxis: {
      title: {
        text: xAxisTitle,
        margin: 10,
        style: { fontSize: '1.0rem', fontWeight: 'bold' },
      },
      labels: { style: { fontSize: '0.85rem', fontWeight: 'bold' } },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        margin: 20,
        style: { fontSize: '1.0rem', fontWeight: 'bold' },
      },
      labels: { style: { fontSize: '0.85rem', fontWeight: 'bold' } },
    },
    plotOptions: {
      boxplot: {
        boxDashStyle: 'Solid',
        lineColor: '#000000',
        lineWidth: 2,
        medianColor: '#000000',
        medianDashStyle: 'Solid',
        medianWidth: 4,
        stemColor: '#000000',
        stemDashStyle: 'Solid',
        stemWidth: 2,
        whiskerColor: '#000000',
        whiskerLength: '50%',
        whiskerWidth: 3,
      },
      scatter: {
        jitter: { x: 0.1, y: 0 },
        marker: { radius: 5, symbol: 'circle' },
        tooltip: { pointFormat: scatterTooltipFormat },
      },
    },
    credits: { enabled: false },
    legend: { squareSymbol: true, symbolWidth: 25 },
    exporting: { enabled: true },
  };
}

// correlation matrix chart options
export function correlationMatrixChartOptions(
  xAxisTitle,
  yAxisTitle,
  tooltipFormat,
) {
  return {
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1,
    },
    xAxis: {
      title: {
        text: xAxisTitle,
        margin: 10,
        style: { fontSize: '1.0rem', fontWeight: 'bold' },
      },
      labels: { style: { fontSize: '0.85rem', fontWeight: 'bold' } },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        margin: 20,
        style: { fontSize: '1.0rem', fontWeight: 'bold' },
      },
      labels: { style: { fontSize: '0.85rem', fontWeight: 'bold' } },
    },
    tooltip: {
      format: tooltipFormat,
    },
    credits: { enabled: false },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      padding: 15,
      title: {
        text: 'Correlation',
        style: { fontWeight: 'normal', fontSize: '1.0rem' },
      },
    },
    exporting: { enabled: true },
  };
}
