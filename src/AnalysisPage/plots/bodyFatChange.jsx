import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryBoxPlot, VictoryAxis } from 'victory';
import colors from '../../lib/colors';
import plotConfig, { searchRat } from './sharedConfig';

/**
 * Renders chart.js plot of pass1b-06 animal body fat change after training
 *
 * @param {String} plot Redux state of plot view
 *
 * @returns {object} JSX representation of the body fat change boxplot
 */
function BodyFatChangePlot({ plot }) {
  // Get array of pre-training weights given the gender
  function postTrainData(gender, visit) {
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
              visit1Data.push(+matches[0].nmr_fat);
              visit2Data.push(+matches[1].nmr_fat);
            } else {
              visit1Data.push(+matches[1].nmr_fat);
              visit2Data.push(+matches[0].nmr_fat);
            }
          } else if (matches.length && matches.length === 1) {
            visit1Data.push(+matches[0].nmr_fat);
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
              visit1Data.push(+matches[0].nmr_fat);
              visit2Data.push(+matches[1].nmr_fat);
            } else {
              visit1Data.push(+matches[1].nmr_fat);
              visit2Data.push(+matches[0].nmr_fat);
            }
          } else if (matches.length && matches.length === 1) {
            visit1Data.push(+matches[0].nmr_fat);
          }
        }
      });
    }

    return visit === 'visit-1' ? visit1Data : visit2Data;
  }

  const singleVisitData = [
    { x: 'Post-train females', y: postTrainData('female', 'visit-1') },
    { x: 'Post-train males', y: postTrainData('male', 'visit-1') },
  ];

  const multiVisitsData = [
    { x: '1st post-train\nfemales', y: postTrainData('female', 'visit-1') },
    { x: '2nd post-train\nfemales', y: postTrainData('female', 'visit-2') },
    { x: '1st post-train\nmales', y: postTrainData('male', 'visit-1') },
    { x: '2nd post-train\nmales', y: postTrainData('male', 'visit-2') },
  ];

  const plotDomainPadding =
    plot === 'four_week_program' || plot === 'eight_week_program'
      ? plotConfig.multiVisitsDomainPadding
      : plotConfig.singleVisitDomainPadding;
  const plotCategories =
    plot === 'four_week_program' || plot === 'eight_week_program'
      ? plotConfig.multiVisitsCategories
      : plotConfig.singleVisitCategories;
  const plotData =
    plot === 'four_week_program' || plot === 'eight_week_program'
      ? multiVisitsData
      : singleVisitData;

  return (
    <div className="bodyFatPlot w-100">
      <VictoryChart
        domainPadding={plotDomainPadding}
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
          domain={{ y: [5, 20] }}
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
          label="Body Fat (%)"
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

BodyFatChangePlot.propTypes = {
  plot: PropTypes.string.isRequired,
};

export default BodyFatChangePlot;
