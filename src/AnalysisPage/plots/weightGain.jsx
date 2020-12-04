import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryBoxPlot, VictoryAxis } from 'victory';
import colors from '../../lib/colors';
import plotConfig, { searchRat } from './sharedConfig';

/**
 * Renders chart.js plot of pass1b-06 animal weight change after training
 *
 * @returns {object} JSX representation of the weight change boxplot
 */
function WeightGainPlot({ plot }) {
  // Get array of pre-training weights given the gender
  function preWeightData(gender) {
    const data = [];

    if (gender === 'female') {
      plotConfig.femaleRats.forEach((rat) => {
        const matchFound = searchRat(rat, plot);
        if (matchFound) {
          data.push(+rat.weight);
        }
      });
    } else if (gender === 'male') {
      plotConfig.maleRats.forEach((rat) => {
        const matchFound = searchRat(rat, plot);
        if (matchFound) {
          data.push(+rat.weight);
        }
      });
    }

    return data;
  }

  // Get array of post-training weights given the gender
  function postWeightData(gender, visit) {
    const visit1Data = [];
    const visit2Data = [];
    let matches;

    if (gender === 'female') {
      plotConfig.femaleRats.forEach((rat) => {
        const matchFound = searchRat(rat, plot);
        if (matchFound) {
          matches = plotConfig.pass1b06PhenoNmrTestingAnimal.filter(
            (item) => item.pid === matchFound.pid
          );
          if (matches.length && matches.length > 1) {
            if (+matches[0].days_visit < +matches[1].days_visit) {
              visit1Data.push(+matches[0].nmr_weight);
              visit2Data.push(+matches[1].nmr_weight);
            } else {
              visit1Data.push(+matches[1].nmr_weight);
              visit2Data.push(+matches[0].nmr_weight);
            }
          } else if (matches.length && matches.length === 1) {
            visit1Data.push(+matches[0].nmr_weight);
          }
        }
      });
    } else if (gender === 'male') {
      plotConfig.maleRats.forEach((rat) => {
        const matchFound = searchRat(rat, plot);
        if (matchFound) {
          matches = plotConfig.pass1b06PhenoNmrTestingAnimal.filter(
            (item) => item.pid === matchFound.pid
          );
          if (matches.length && matches.length > 1) {
            if (+matches[0].days_visit < +matches[1].days_visit) {
              visit1Data.push(+matches[0].nmr_weight);
              visit2Data.push(+matches[1].nmr_weight);
            } else {
              visit1Data.push(+matches[1].nmr_weight);
              visit2Data.push(+matches[0].nmr_weight);
            }
          } else if (matches.length && matches.length === 1) {
            visit1Data.push(+matches[0].nmr_weight);
          }
        }
      });
    }

    return visit === 'visit-1' ? visit1Data : visit2Data;
  }

  // custom plot categories config
  const singleVisitCategories = {
    x: [
      'Pre-train females',
      'Post-train females',
      'Pre-train males',
      'Post-train males',
    ],
  };

  // custom plot categories config
  const multiVisitsCategories = {
    x: [
      'Pre-train\nfemales',
      '1st post-train\nfemales',
      '2nd post-train\nfemales',
      'Pre-train\nmales',
      '1st post-train\nmales',
      '2nd post-train\nmales',
    ],
  };

  // custom plot data config
  const singleVisitData = [
    { x: 'Pre-train females', y: preWeightData('female') },
    { x: 'Post-train females', y: postWeightData('female', 'visit-1') },
    { x: 'Pre-train males', y: preWeightData('male') },
    { x: 'Post-train males', y: postWeightData('male', 'visit-1') },
  ];

  // custom plot data config
  const multiVisitsData = [
    { x: 'Pre-train\nfemales', y: preWeightData('female') },
    { x: '1st post-train\nfemales', y: postWeightData('female', 'visit-1') },
    { x: '2nd post-train\nfemales', y: postWeightData('female', 'visit-2') },
    { x: 'Pre-train\nmales', y: preWeightData('male') },
    { x: '1st post-train\nmales', y: postWeightData('male', 'visit-1') },
    { x: '2nd post-train\nmales', y: postWeightData('male', 'visit-2') },
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
    <div className="weightGainPlot w-100">
      <VictoryChart
        domainPadding={{ x: 40 }}
        height={250}
        padding={{ top: 20, bottom: 35, left: 55, right: 20 }}
      >
        <VictoryBoxPlot
          animate={{
            duration: 400,
            onLoad: { duration: 200 },
          }}
          boxWidth={40}
          categories={plotCategories}
          data={plotData}
          domain={{ y: [125, 425] }}
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
          label="Weight (gm)"
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
        Datasets used as input: <em>Animal Registration</em>, <em>Animal Key</em>, <em>Animal NMR Testing</em>.
      </p>
    </div>
  );
}

WeightGainPlot.propTypes = {
  plot: PropTypes.string.isRequired,
};

export default WeightGainPlot;
