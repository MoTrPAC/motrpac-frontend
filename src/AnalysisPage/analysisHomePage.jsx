import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import analysisTypes from '../lib/analysisTypes';
import AuthContentContainer from '../lib/ui/authContentContainer';
import AnalysisCard from './analysisCard';
import AnimalDataAnalysis from './animalDataAnalysis';

import '@styles/analysisPage.scss';

// TODO: Add animation of transitions potentially with CSSTransitions package

export function AnalysisHomePage({
  match = {
    params: {
      subjectType: '',
    },
  }, // match object from react-router used to find human vs animal in route
  depth,
  currentAnalysis,
  currentAnalysisTitle,
  onPickAnalysis,
  goBack,
  profile = {},
}) {
  const subjectType = match.params.subjectType.slice(0).toLowerCase();
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Redirects to dashboard if incorrect url
  if (
    !(subjectType === 'animal' || subjectType === 'human') ||
    userType === 'external'
  ) {
    return <Navigate to="/dashboard" />;
  }

  // Button to return 1 depth level
  function BackButton() {
    return (
      <button className="backButton" onClick={goBack} type="button">
        <span className="material-icons">arrow_back</span>
      </button>
    );
  }

  // Return a subset of top level analyses by selected species
  const analysesBySpecies = analysisTypes.filter(
    (item) => item.species.indexOf(subjectType) > -1
  );
  // Render a subset of top level analyses
  const selectAnalysis = analysesBySpecies.map((analysisType) => (
    <AnalysisCard
      key={analysisType.shortName}
      analysisType={analysisType}
      onPickAnalysis={onPickAnalysis}
    />
  ));

  // Sets subject label for title display
  const titleSubjectLabel = subjectType
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  // Render header title
  function renderHeaderTitle() {
    let headerTitle;

    if (depth === 0) headerTitle = `${titleSubjectLabel} Data Analysis`;
    if (depth === 1)
      headerTitle = `${currentAnalysisTitle} (${titleSubjectLabel})`;

    return headerTitle;
  }

  return (
    <AuthContentContainer classes="analysisPage">
      <div className="page-title pt-3 pb-2 mb-3 border-bottom">
        <h3>
          {depth > 0 ? <BackButton /> : ''}
          {renderHeaderTitle()}
        </h3>
      </div>
      {depth === 0 && (
        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 mt-4">
          {selectAnalysis}
        </div>
      )}
      {depth === 1 && subjectType === 'animal' && (
        <AnimalDataAnalysis analysis={currentAnalysis} />
      )}
    </AuthContentContainer>
  );
}

AnalysisHomePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectType: PropTypes.string.isRequired,
    }).isRequired,
  }),
  depth: PropTypes.number.isRequired,
  currentAnalysis: PropTypes.string.isRequired,
  currentAnalysisTitle: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  onPickAnalysis: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};


const mapStateToProps = (state) => ({
  depth: state.analysis.depth,
  currentAnalysis: state.analysis.currentAnalysis,
  currentAnalysisTitle: state.analysis.currentAnalysisTitle,
  profile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  onPickAnalysis: (analysis, analysisTitle) =>
    dispatch({
      type: 'ANALYSIS_SELECT',
      analysis,
      analysisTitle,
    }),
  goBack: () =>
    dispatch({
      type: 'GO_BACK',
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisHomePage);
