import React from 'react';
import { VictoryChart, VictoryBoxPlot, VictoryAxis } from 'victory';

const pass1b06PhenoRegistrationAnimal = require('../../data/pass1b_06_pheno_registration_animal');
const pass1b06PhenoVo2MaxAnimal = require('../../data/pass1b_06_pheno_vo2_max_animal');

/**
 * Renders chart.js plot of pass1b-06 animal vo2 max change after training
 *
 * @returns {object} JSX representation of the vo2 max change boxplot
 */
function VO2MaxChangePlot() {
  // female set
  const femaleRats = pass1b06PhenoRegistrationAnimal.filter(
    (item) => item.sex === 'female'
  );

  // male set
  const maleRats = pass1b06PhenoRegistrationAnimal.filter(
    (item) => item.sex === 'male'
  );

  // Get array of pre-training weights given the gender
  function postFatData(gender, visit) {
    const visit1Data = [];
    const visit2Data = [];
    let matches;

    if (gender === 'female') {
      femaleRats.forEach((rat) => {
        matches = pass1b06PhenoVo2MaxAnimal.filter(
          (item) => item.pid === rat.pid
        );
        if (matches.length && matches.length === 2) {
          if (+matches[0].days_visit < +matches[1].days_visit) {
            visit1Data.push(+matches[0].vo2_max);
            visit2Data.push(+matches[1].vo2_max);
          } else {
            visit1Data.push(+matches[1].vo2_max);
            visit2Data.push(+matches[0].vo2_max);
          }
        }
      });
    } else if (gender === 'male') {
      maleRats.forEach((rat) => {
        matches = pass1b06PhenoVo2MaxAnimal.filter(
          (item) => item.pid === rat.pid
        );
        if (matches.length && matches.length === 2) {
          if (+matches[0].days_visit < +matches[1].days_visit) {
            visit1Data.push(+matches[0].vo2_max);
            visit2Data.push(+matches[1].vo2_max);
          } else {
            visit1Data.push(+matches[1].vo2_max);
            visit2Data.push(+matches[0].vo2_max);
          }
        }
      });
    }

    return visit === 'visit-1' ? visit1Data : visit2Data;
  }

  return (
    <div className="bodyFatPlot w-100">
      <VictoryChart
        domainPadding={{ x: 40 }}
        height={250}
        padding={{ top: 20, bottom: 35, left: 65, right: 20 }}
      >
        <VictoryBoxPlot
          boxWidth={40}
          categories={{
            x: [
              '1st visit females',
              '2nd visit females',
              '1st visit males',
              '2nd visit males',
            ],
          }}
          data={[
            { x: '1st visit females', y: postFatData('female', 'visit-1') },
            { x: '2nd visit females', y: postFatData('female', 'visit-2') },
            { x: '1st visit males', y: postFatData('male', 'visit-1') },
            { x: '2nd visit males', y: postFatData('male', 'visit-2') },
          ]}
          domain={{ y: [45, 95] }}
          style={{
            min: { stroke: '#ffde72' },
            max: { stroke: '#f9c002' },
            q1: { fill: '#ffde72' },
            q3: { fill: '#f9c002' },
            median: { stroke: '#fff', strokeWidth: 2 },
            minLabels: { fill: '#ffde72' },
            maxLabels: { fill: '#f9c002' },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="VO2 Max (mL/kg/min)"
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
        By matching each of the unique participant IDs from the <em>Animal Registration Form</em>, a dataset
        is created by aggregating the entries from the <em>Animal VO2 Max Test Form</em>. The resulted
        dataset is further filtered to only retain those participants with two separate visits.
      </p>
    </div>
  );
}

export default VO2MaxChangePlot;
