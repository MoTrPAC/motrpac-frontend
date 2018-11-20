import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import globeIcon from '../assets/analysisIcons/Globe.png';
import moleculeIcon from '../assets/analysisIcons/Molecule.png';

const analysisTypes = [
  {
    title: 'Published Data Meta-Analysis',
    icon: globeIcon,
  },
  {
    title: 'Differential Molecules',
    icon: moleculeIcon,
  },
];

export function AnalysisHomePage({ match }) {
  let subjectType = match.params.subjectType.slice(0).toLowerCase();

  // Redirects to dashboard if incorrect url
  if (!(subjectType === 'animal' || subjectType === 'human')) {
    return <Redirect to="/dashboard" />;
  }
  const analyses = analysisTypes
    .map(analysisType => <AnalysisTypeButton key={analysisType.title} analysisType={analysisType} />);

  // Sets subject type to title case
  subjectType = subjectType
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  return (
    <div className="container analysisPage">
      <div className="row">
        <div className="col">
          <h2 className="light">
            {subjectType}
            &nbsp; Data Analysis
          </h2>
        </div>
      </div>
      <div className="row">
        {analyses}
      </div>
    </div>
  );
}

AnalysisHomePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectType: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

function AnalysisTypeButton({ analysisType }) {
  return (
    <div className="col-6 col-md-4 col-lg-3">
      <button type="button" className="btn analysisTypeButton">
        <h3>{analysisType.title}</h3>
        <img src={analysisType.icon} alt={`${analysisType.title} Icon`} />
      </button>
    </div>
  );
}

export default connect()(AnalysisHomePage);
