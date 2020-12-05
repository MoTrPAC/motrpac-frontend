import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryBoxPlot, VictoryAxis } from 'victory';
import colors from '../../lib/colors';
import plotConfig, { searchRat } from './sharedConfig';

/**
 * Renders chart.js plot of pass1b-06 animal blood lactate change after training
 *
 * @param {String} plot Redux state of plot view
 *
 * @returns {object} JSX representation of the blood lactate change boxplot
 */
function LactateChangePlot({ plot }) {
  // Get array of pre-training weights given the gender
  function postTrainData(gender, visit) {
    const visit1Data = {
      lactate_begin: [],
      lactate_end: [],
    };
    const visit2Data = {
      lactate_begin: [],
      lactate_end: [],
    };
    let matches;

    if (gender === 'female') {
      plotConfig.femaleRats.forEach((rat) => {
        const matchFound = searchRat(rat, plot);
        if (matchFound) {
          matches = plotConfig.pass1b06PhenoVo2MaxAnimal.filter(
            (item) => item.pid === matchFound.pid
          );
          if (matches.length && matches.length > 1) {
            if (+matches[0].days_visit < +matches[1].days_visit) {
              visit1Data.lactate_begin.push(+matches[0].blactate_begin);
              visit1Data.lactate_end.push(+matches[0].blactate_end);
              visit2Data.lactate_begin.push(+matches[1].blactate_begin);
              visit2Data.lactate_end.push(+matches[1].blactate_end);
            } else {
              visit1Data.lactate_begin.push(+matches[1].blactate_begin);
              visit1Data.lactate_end.push(+matches[1].blactate_end);
              visit2Data.lactate_begin.push(+matches[0].blactate_begin);
              visit2Data.lactate_end.push(+matches[0].blactate_end);
            }
          } else if (matches.length && matches.length === 1) {
            visit1Data.lactate_begin.push(+matches[0].blactate_begin);
            visit1Data.lactate_end.push(+matches[0].blactate_end);
          }
        }
      });
    } else if (gender === 'male') {
      plotConfig.maleRats.forEach((rat) => {
        const matchFound = searchRat(rat, plot);
        if (matchFound) {
          matches = plotConfig.pass1b06PhenoVo2MaxAnimal.filter(
            (item) => item.pid === matchFound.pid
          );
          if (matches.length && matches.length > 1) {
            if (+matches[0].days_visit < +matches[1].days_visit) {
              visit1Data.lactate_begin.push(+matches[0].blactate_begin);
              visit1Data.lactate_end.push(+matches[0].blactate_end);
              visit2Data.lactate_begin.push(+matches[1].blactate_begin);
              visit2Data.lactate_end.push(+matches[1].blactate_end);
            } else {
              visit1Data.lactate_begin.push(+matches[1].blactate_begin);
              visit1Data.lactate_end.push(+matches[1].blactate_end);
              visit2Data.lactate_begin.push(+matches[0].blactate_begin);
              visit2Data.lactate_end.push(+matches[0].blactate_end);
            }
          } else if (matches.length && matches.length === 1) {
            // omit entries with null value
            if (matches[0].blactate_begin && matches[0].blactate_end) {
              visit1Data.lactate_begin.push(+matches[0].blactate_begin);
              visit1Data.lactate_end.push(+matches[0].blactate_end);
            }
          }
        }
      });
    }

    return visit === 'visit-1' ? visit1Data : visit2Data;
  }

  // custom plot categories config
  const singleVisitCategories = {
    x: [
      'Train-begin females',
      'Train-end females',
      'Train-begin males',
      'Train-end males',
    ],
  };

  // custom plot categories config
  const multiVisitsCategories = {
    x: [
      '1st\ntrain-begin\nfemales',
      '1st\ntrain-end\nfemales',
      '2nd\ntrain-begin\nfemales',
      '2nd\ntrain-end\nfemales',
      '1st\ntrain-begin\nmales',
      '1st\ntrain-end\nmales',
      '2nd\ntrain-begin\nmales',
      '2nd\ntrain-end\nmales',
    ],
  };

  // custom plot data config
  const singleVisitData = [
    { x: 'Train-begin females', y: postTrainData('female', 'visit-1').lactate_begin },
    { x: 'Train-end females', y: postTrainData('female', 'visit-1').lactate_end },
    { x: 'Train-begin males', y: postTrainData('male', 'visit-1').lactate_begin },
    { x: 'Train-end males', y: postTrainData('male', 'visit-1').lactate_end },
  ];

  // custom plot data config
  const multiVisitsData = [
    { x: '1st\ntrain-begin\nfemales', y: postTrainData('female', 'visit-1').lactate_begin },
    { x: '1st\ntrain-end\nfemales', y: postTrainData('female', 'visit-1').lactate_end },
    { x: '2nd\ntrain-begin\nfemales', y: postTrainData('female', 'visit-2').lactate_begin },
    { x: '2nd\ntrain-end\nfemales', y: postTrainData('female', 'visit-2').lactate_end },
    { x: '1st\ntrain-begin\nmales', y: postTrainData('male', 'visit-1').lactate_begin },
    { x: '1st\ntrain-end\nmales', y: postTrainData('male', 'visit-1').lactate_end },
    { x: '2nd\ntrain-begin\nmales', y: postTrainData('male', 'visit-1').lactate_begin },
    { x: '2nd\ntrain-end\nmales', y: postTrainData('female', 'visit-1').lactate_end },
  ];

  const plotCategories =
    plot === 'four_week_program' || plot === 'eight_week_program'
      ? multiVisitsCategories
      : singleVisitCategories;
  const plotData =
    plot === 'four_week_program' || plot === 'eight_week_program'
      ? multiVisitsData
      : singleVisitData;

  return (
    <div className="bodyFatPlot w-100">
      <VictoryChart
        domainPadding={{ x: 40 }}
        height={250}
        padding={{ top: 20, bottom: 40, left: 55, right: 20 }}
      >
        <VictoryBoxPlot
          animate={{
            duration: 400,
            onLoad: { duration: 200 },
          }}
          boxWidth={plot === 'four_week_program' || plot === 'eight_week_program' ? 30 : 40}
          categories={plotCategories}
          data={plotData}
          domain={{ y: [0, 20] }}
          style={{
            min: { stroke: colors.graphs.lgray },
            max: { stroke: colors.graphs.lgray },
            q1: { fill: ({ datum }) => datum.x.indexOf('females') > -1 ? colors.gender.female : colors.gender.male, fillOpacity: 0.6 },
            q3: { fill: ({ datum }) => datum.x.indexOf('females') > -1 ? colors.gender.female : colors.gender.male },
            median: { stroke: '#fff', strokeWidth: 2 },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Blood Lactate (mmol/L)"
          style={{
            axisLabel: { fontSize: 13, padding: 30 },
            ticks: { stroke: '#000', size: 5 },
            tickLabels: { fontSize: 9, padding: 2 },
          }}
        />
        <VictoryAxis
          crossAxis
          style={{
            ticks: { stroke: '#000', size: 5 },
            tickLabels: { fontSize: 9, padding: 2 },
          }}
        />
      </VictoryChart>
      <p className="card-text remark">
        Datasets used as input: <em>Animal Registration</em>, <em>Animal Key</em>, <em>Animal VO2 Max Test</em>.
        <br />
        Data is shown as mean +- SD.
      </p>
    </div>
  );
}

LactateChangePlot.propTypes = {
  plot: PropTypes.string.isRequired,
};

export default LactateChangePlot;
