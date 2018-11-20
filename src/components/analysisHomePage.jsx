import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import analysisTypes from '../assets/analysisIcons/analysisTypes';

export function AnalysisHomePage({ match, depth, currentAnalysis, onPickAnalysis, goBack }) {
  let subjectType = match.params.subjectType.slice(0).toLowerCase();

  // Redirects to dashboard if incorrect url
  if (!(subjectType === 'animal' || subjectType === 'human')) {
    return <Redirect to="/dashboard" />;
  }

  // Button to select inital analysis category
  function AnalysisTypeButton({ analysisType }) {
    return (
      <div id={analysisType.shortName} onClick={onPickAnalysis} onKeyPress={onPickAnalysis} tabIndex={0} role="button" className="col-5 col-md-4 col-lg-2 m-3 analysisType">
        <p className="centered">{analysisType.title}</p>
        <img src={analysisType.icon} className="align-self-end" alt={`${analysisType.title} Icon`} />
      </div>
    );
  }
  AnalysisTypeButton.propTypes = {
    analysisType: PropTypes.shape({
      title: PropTypes.string,
      shortName: PropTypes.string,
      icon: PropTypes.string,
    }).isRequired,
  };

  // Button to return 1 depth level
  function BackButton() {
    return <button onClick={goBack} type="button"><span className="oi backButton oi-arrow-thick-left" /></button>;
  }
  // Analysis split in to groups of three for rendering in 2 rows
  const threeAnalyses = analysisTypes.slice(0, 3)
    .map(analysisType => (
      <AnalysisTypeButton
        key={analysisType.shortName}
        analysisType={analysisType}
      />));
  const nextThreeAnalyses = analysisTypes.slice(3)
    .map(analysisType => (
      <AnalysisTypeButton
        key={analysisType.shortName}
        analysisType={analysisType}
      />));

  const selectAnalysis = (
    <div>
      <div className="row justify-content-center">
        {threeAnalyses}
      </div>
      <div className="row justify-content-center">
        {nextThreeAnalyses}
      </div>
    </div>
  );

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
        <div className="col">
          {(depth > 0) ? <BackButton /> : ''}
        </div>
      </div>
      {(depth === 1) ? currentAnalysis : ''}
      {(depth === 0) ? selectAnalysis : ''}
    </div>
  );
}

AnalysisHomePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectType: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  depth: PropTypes.number.isRequired,
  currentAnalysis: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  onPickAnalysis: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  depth: state.analysis.depth,
  currentAnalysis: state.analysis.currentAnalysis,
});
const mapDispatchToProps = dispatch => ({
  onPickAnalysis: e => dispatch({
    type: 'ANALYSIS_SELECT',
    analysis: e.currentTarget.id,
  }),
  goBack: () => dispatch({
    type: 'GO_BACK',
  }),
});


export default connect(mapStateToProps, mapDispatchToProps)(AnalysisHomePage);
