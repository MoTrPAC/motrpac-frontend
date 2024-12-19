import pass1ac06Data from '../../pass1ac-animal_pheno.json';

// male data
export const pass1aMaleAcute = pass1ac06Data.filter((item) => item.phase === 'pass1a' && item.sex === 'male' && item.intervention === 'acute');
export const pass1aMaleControl = pass1ac06Data.filter((item) => item.phase === 'pass1a' && item.sex === 'male' && item.intervention === 'control');
export const pass1cMaleAcute = pass1ac06Data.filter((item) => item.phase === 'pass1c' && item.sex === 'male' && item.intervention === 'acute');
export const pass1cMaleControl = pass1ac06Data.filter((item) => item.phase === 'pass1c' && item.sex === 'male' && item.intervention === 'control');

// female data
export const pass1aFemaleAcute = pass1ac06Data.filter((item) => item.phase === 'pass1a' && item.sex === 'female' && item.intervention === 'acute');
export const pass1aFemaleControl = pass1ac06Data.filter((item) => item.phase === 'pass1a' && item.sex === 'female' && item.intervention === 'control');
export const pass1cFemaleAcute = pass1ac06Data.filter((item) => item.phase === 'pass1c' && item.sex === 'female' && item.intervention === 'acute');
export const pass1cFemaleControl = pass1ac06Data.filter((item) => item.phase === 'pass1c' && item.sex === 'female' && item.intervention === 'control');

export const groupiCategory = [
  'acute_00.0h_IPE', 'acute_00.5h', 'acute_01.0h', 'acute_04.0h',
  'acute_07.0h', 'acute_24.0h', 'acute_48.0h', 'control_00.0h',
  'control_00.0h_IPE', 'control_00.5h', 'control_04.0h', 'control_07.0h',
];

const createGroupiData = (phase, sex) => groupiCategory.reduce((acc, groupi) => {
  acc[groupi] = pass1ac06Data.filter((item) => item.phase === phase && item.sex === sex && item.groupi === groupi);
  return acc;
}, {});

// male groupi data
export const pass1aMaleGroupi = createGroupiData('pass1a', 'male');
export const pass1cMaleGroupi = createGroupiData('pass1c', 'male');

// female groupi data
export const pass1aFemaleGroupi = createGroupiData('pass1a', 'female');
export const pass1cFemaleGroupi = createGroupiData('pass1c', 'female');

// Function to get all box plot data by phase, sex, and each of the groupi categories
export function allBoxPlotDataByPhaseSexGroupi(processData) {
  const boxPlotData = {};
  // male groupi data
  Object.keys(pass1aMaleGroupi).forEach((groupi) => {
    boxPlotData[`pass1aMale${groupi}`] = calculateBoxPlotData(pass1aMaleGroupi[groupi], processData);
  });
  Object.keys(pass1cMaleGroupi).forEach((groupi) => {
    boxPlotData[`pass1cMale${groupi}`] = calculateBoxPlotData(pass1cMaleGroupi[groupi], processData);
  });
  // female groupi data
  Object.keys(pass1aFemaleGroupi).forEach((groupi) => {
    boxPlotData[`pass1aFemale${groupi}`] = calculateBoxPlotData(pass1aFemaleGroupi[groupi], processData);
  });
  Object.keys(pass1cFemaleGroupi).forEach((groupi) => {
    boxPlotData[`pass1cFemale${groupi}`] = calculateBoxPlotData(pass1cFemaleGroupi[groupi], processData);
  });
  return boxPlotData;
}

// Function to get all scatter plot data by phase, sex, and each of the groupi categories
export function allScatterPlotDataByPhaseSexGroupi(processData) {
  const getScatterPlots = (groupiData, offset) => Object.keys(groupiData).reduce((acc, groupi) => {
    acc[groupi] = processData(groupiData[groupi]).map((value, x) => [x + offset, Math.round(value * 1000) / 1000]);
    return acc;
  }, {});

  return {
    pass1a: {
      male: getScatterPlots(pass1aMaleGroupi, -0.15),
      female: getScatterPlots(pass1aFemaleGroupi, -0.15),
    },
    pass1c: {
      male: getScatterPlots(pass1cMaleGroupi, 0.15),
      female: getScatterPlots(pass1cFemaleGroupi, 0.15),
    },
  };
}

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
  const getScatterPlots = (acuteData, controlData) => [processData(acuteData), processData(controlData)];

  const createScatterData = (acuteData, controlData, offset) => getScatterPlots(acuteData, controlData)
      .reduce((acc, data, x) => acc.concat(data.map((value) => [x + offset, Math.round(value * 1000) / 1000])), []);

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
export function defaultChartOptions(xAxisTitle, yAxisTitle, scatterTooltipFormat) {
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
