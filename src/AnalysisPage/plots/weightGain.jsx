import React from 'react';
import { VictoryChart, VictoryBoxPlot, VictoryAxis } from 'victory';
import colors from '../../lib/colors';

const pass1b06PhenoRegistrationAnimal = require('../../data/pass1b_06_pheno_registration_animal');
const pass1b06PhenoCalculatedVariablesAnimal = require('../../data/pass1b_06_pheno_calculated_variables_animal');

/**
 * Renders chart.js plot of pass1b-06 animal weight change after training
 *
 * @returns {object} JSX representation of the weight change boxplot
 */
function WeightGainPlot() {
  // female set
  const femaleRats = pass1b06PhenoRegistrationAnimal.filter(
    (item) => item.sex === 'female'
  );

  // male set
  const maleRats = pass1b06PhenoRegistrationAnimal.filter(
    (item) => item.sex === 'male'
  );

  // Get array of pre-training weights given the gender
  function preWeightData(gender) {
    const data = [];

    if (gender === 'female') {
      femaleRats.forEach((rat) => {
        data.push(+rat.weight);
      });
    } else if (gender === 'male') {
      maleRats.forEach((rat) => {
        data.push(+rat.weight);
      });
    }

    return data;
  }

  // Get array of post-training weights given the gender
  function postWeightData(gender) {
    const data = [];
    let match;

    if (gender === 'female') {
      femaleRats.forEach((rat) => {
        match = pass1b06PhenoCalculatedVariablesAnimal.find(
          (item) => item.pid === rat.pid
        );
        if (match && Object.keys(match).length > 0) {
          const postWeight =
            Number(rat.weight) + Number(match.wgt_gain_after_train);
          data.push(postWeight);
        }
      });
    } else if (gender === 'male') {
      maleRats.forEach((rat) => {
        match = pass1b06PhenoCalculatedVariablesAnimal.find(
          (item) => item.pid === rat.pid
        );
        if (match && Object.keys(match).length > 0) {
          const postWeight =
            Number(rat.weight) + Number(match.wgt_gain_after_train);
          data.push(postWeight);
        }
      });
    }

    return data;
  }

  return (
    <div className="weightGainPlot w-100">
      <VictoryChart
        domainPadding={{ x: 40 }}
        height={250}
        padding={{ top: 20, bottom: 35, left: 65, right: 20 }}
      >
        <VictoryBoxPlot
          boxWidth={40}
          categories={{
            x: [
              'Pre-train females',
              'Post-train females',
              'Pre-train males',
              'Post-train males',
            ],
          }}
          data={[
            { x: 'Pre-train females', y: preWeightData('female') },
            { x: 'Post-train females', y: postWeightData('female') },
            { x: 'Pre-train males', y: preWeightData('male') },
            { x: 'Post-train males', y: postWeightData('male') },
          ]}
          domain={{ y: [100, 450] }}
          style={{
            min: { stroke: colors.graphs.lblue },
            max: { stroke: colors.graphs.dblue },
            q1: { fill: colors.graphs.lblue },
            q3: { fill: colors.graphs.dblue },
            median: { stroke: '#fff', strokeWidth: 2 },
            minLabels: { fill: colors.graphs.lblue },
            maxLabels: { fill: colors.graphs.dblue },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Weight (gm)"
          style={{
            axisLabel: { fontSize: 13, padding: 40 },
            ticks: { stroke: '#000', size: 5 },
            tickLabels: { fontSize: 10, padding: 4 },
          }}
        />
        <VictoryAxis
          crossAxis
          style={{
            ticks: { stroke: '#000', size: 5 },
            tickLabels: { fontSize: 10, padding: 4 },
          }}
        />
      </VictoryChart>
      <p className="card-text remark">
        A dataset of pre-training weights is created given each of the unique
        participant IDs from the <em>Animal Registratioin Form</em>. The dataset
        of post-training weights is created by calculating the sum of pre-training
        weight and weight change after training for each of the participants.
      </p>
    </div>
  );
}

export default WeightGainPlot;
