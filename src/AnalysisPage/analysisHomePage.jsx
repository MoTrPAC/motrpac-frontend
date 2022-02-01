import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import analysisTypes from '../lib/analysisTypes';
import AnimalDataAnalysis from './animalDataAnalysis';
import AuthContentContainer from '../lib/ui/authContentContainer';
import AnalysisCard from './analysisCard';

// TODO: Add animation of transitions potentially with CSSTransitions package

export function AnalysisHomePage({
  match, // match object from react-router used to find human vs animal in route
  depth,
  currentAnalysis,
  currentAnalysisTitle,
  onPickAnalysis,
  goBack,
  expanded,
  profile,
}) {
  const subjectType = match.params.subjectType.slice(0).toLowerCase();
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Redirects to dashboard if incorrect url
  if (
    !(subjectType === 'animal' || subjectType === 'human') ||
    userType === 'external'
  ) {
    return <Redirect to="/dashboard" />;
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
    <AuthContentContainer classes="analysisPage" expanded={expanded}>
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
  expanded: PropTypes.bool,
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

AnalysisHomePage.defaultProps = {
  match: {
    params: {
      subjectType: '',
    },
  },
  expanded: false,
  profile: {},
};

const mapStateToProps = (state) => ({
  depth: state.analysis.depth,
  currentAnalysis: state.analysis.currentAnalysis,
  currentAnalysisTitle: state.analysis.currentAnalysisTitle,
  expanded: state.sidebar.expanded,
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
