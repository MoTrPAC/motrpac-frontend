import React from 'react';
import { Helmet } from 'react-helmet';
import ReactWordcloud from 'react-wordcloud';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';
import exerciseBenefitsData from './exerciseBenefitsData';
import exerciseBenefitsReferenceData from './exerciseBenefitsReferenceData';

import '@styles/mainStudyPage.scss';

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
  'Reduced risk of cardiovascular diseases',
  'Improved cognition',
  'Reduced stress response',
  'Reduced risk for dementia',
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
              {exerciseBenefitsData.map((benefit) => (
                <tr key={`${benefit.title}`}>
                  <th scope="row">{benefit.title}</th>
                  <td>
                    {benefit.evidence}
                    <sup>
                      [
                      <a href={`#cite-${benefit.citationNo}`}>
                        {benefit.citationNo}
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            These benefits underscore the importance of regular physical activity
            as a cornerstone of preventive health care.
          </p>
        </div>
        <div className="exercise-benefits-page-content-container row mt-3 mb-4">
          <div className="col-12">
            <h5 className="border-bottom mb-3 pb-2">
              References:
            </h5>
            <ol className="cexercise-benefits-itation-list">
              {exerciseBenefitsReferenceData.map((reference) => (
                <li key={`${reference.doi}`} id={`cite-${reference.citationNo}`}>
                  <p>
                    <span className="font-weight-bold">{reference.title}</span>
                    <br />
                    {`${reference.author}.`}
                    <br />
                    {`${reference.journal}.`}
                    {' '}
                    <em>{`${reference.publicationIssue}.`}</em>
                    <br />
                    doi:
                    {' '}
                    <ExternalLink
                      to={`https://doi.org/${reference.doi}`}
                      label={reference.doi}
                    />
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseBenefits;
