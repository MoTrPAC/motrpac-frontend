import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactWordcloud from 'react-wordcloud';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

const exerciseBenefits = [
  'Improved immune system',
  'Younger-looking skin',
  'Reduced risk of cancer ',
  'Reduced risk of metabolic disease',
  'Better temperature regulation',
  'Better sex',
  'Improved sleep',
  'Reduced risk for depression',
  'Improved insulin sensitivity',
  'Improved blood lipid profile',
  'Better self-esteem',
  'Better oxygen transport',
  'More, larger, and more efficient mitochondria',
  'Increased reliance on lipid metabolism',
  'Stronger skeleton, joints and tendons',
  'Reduced risk of all-cause mortality',
  'Reduced risk of cardiovascular disease',
  'Improved cognition',
  'Reduced stress response',
  'Reduced risk for dementia',
];

const exerciseBenefitList = [
  {
    title: 'Younger-looking skin',
    evidence: 'Exercise improves skin health by enhancing blood flow and delivering oxygen and nutrients to the skin, promoting collagen production and reducing signs of aging.',
  },
  {
    title: 'Reduced risk of cancer',
    evidence: 'Physical activity is linked to a lower risk of several cancers, including colon, breast, and prostate. The American College of Sports Medicine notes that exercise decreases the risk of developing these cancers.',
  },
  {
    title: 'Reduced risk of metabolic disease',
    evidence: 'Regular exercise improves insulin sensitivity, reduces the risk of type 2 diabetes, and enhances overall metabolic health.',
  },
  {
    title: 'Better temperature regulation',
    evidence: 'Exercise improves thermoregulation by enhancing sweat response and increasing blood flow to the skin.',
  },
  {
    title: 'Better sex',
    evidence: 'Physical activity is associated with improved sexual function and satisfaction, likely due to enhanced cardiovascular health and psychological well-being.',
  },
  {
    title: 'Improved sleep',
    evidence: 'Exercise has been shown to improve sleep quality and reduce the time it takes to fall asleep.',
  },
  {
    title: 'Reduced risk for depression',
    evidence: 'Regular physical activity reduces the risk of depression and anxiety, as highlighted by the United States Department of Health and Human Services.',
  },
];

function ExerciseBenefits() {
  const options = {
    rotations: 0,
    rotationAngles: [0],
    fontFamily: 'sans-serif',
    fontSizes: [20, 60],
    fontWeight: 'bold',
    padding: 1,
    deterministic: false,
    enableTooltip: false,
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const words = exerciseBenefits.map((benefit) => ({
    text: benefit,
    value: getRandomInt(100, 800),
  }));

  return (
    <div className="exerciseBenefitsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Benefits of Exercise - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Benefits of Exercise" />
      <div className="exercise-benefits-page-container">
        <div
          className="exercise-benefits-page-content-container row mb-4"
        >
          <div className="col-12">
            <p className="lead">
              Regular physical activity is associated with many health benefits,
              supported by extensive evidence in the medical literature.
            </p>
          </div>
          <div className="exercise-benefits-cloud col-12">
            <ReactWordcloud words={words} options={options} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Health Benefit</th>
                <th scope="col">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {exerciseBenefitList.map((benefit) => (
                <tr key={`${benefit}`}>
                  <th scope="row">{benefit.title}</th>
                  <td>{benefit.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExerciseBenefits;
