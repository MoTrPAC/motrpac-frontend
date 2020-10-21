import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import analysisTypes from '../lib/analysisTypes';
import AnimalDataAnalysis from './animalDataAnalysis';
import HumanDataAnalysis from './humanDataAnalysis';
import AuthContentContainer from '../lib/ui/authContentContainer';
import AnalysisCard from './analysisCard';
import SubAnalysisCard from './subAnalysisCard';

// TODO: Add animation of transitions potentially with CSSTransitions package

export function AnalysisHomePage({
  match, // match object from react-router used to find human vs animal in route
  depth,
  currentAnalysis,
  currentAnalysisTitle,
  currentSubAnalysis,
  currentSubAnalysisTitle,
  onPickAnalysis,
  onPickSubAnalysis,
  goBack,
  expanded,
}) {
  const subjectType = match.params.subjectType.slice(0).toLowerCase();

  // Redirects to dashboard if incorrect url
  if (!(subjectType === 'animal' || subjectType === 'human')) {
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

  // Return sub-analyses of human meta-analysis of public data
  let selectSubAnalyses;

  if (depth === 1 && subjectType === 'human' && currentAnalysis) {
    const selectedAnalysis = analysesBySpecies.filter(
      (analysis) => analysis.shortName === currentAnalysis
    );
    if (
      selectedAnalysis &&
      selectedAnalysis.length &&
      selectedAnalysis[0].subAnalyses.length
    ) {
      selectSubAnalyses = selectedAnalysis[0].subAnalyses.map((analysis) => (
        <SubAnalysisCard
          key={analysis.shortName}
          subAnalysis={analysis}
          onPickSubAnalysis={onPickSubAnalysis}
        />
      ));
    }
  }

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
    if (depth === 2)
      headerTitle = `${currentSubAnalysisTitle} (${titleSubjectLabel})`;

    return headerTitle;
  }

  return (
    <AuthContentContainer classes="analysisPage" expanded={expanded}>
      <div className="page-title pt-3 pb-2 border-bottom">
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
      {depth === 1 && subjectType === 'human' && (
        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 mt-4">
          {selectSubAnalyses}
        </div>
      )}
      {depth === 2 && subjectType === 'human' && (
        <HumanDataAnalysis
          analysis={currentAnalysis}
          subAnalysis={currentSubAnalysis}
        />
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
  currentSubAnalysis: PropTypes.string.isRequired,
  currentSubAnalysisTitle: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  onPickAnalysis: PropTypes.func.isRequired,
  onPickSubAnalysis: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

AnalysisHomePage.defaultProps = {
  match: {
    params: {
      subjectType: '',
    },
  },
  expanded: false,
};

const mapStateToProps = (state) => ({
  depth: state.analysis.depth,
  currentAnalysis: state.analysis.currentAnalysis,
  currentAnalysisTitle: state.analysis.currentAnalysisTitle,
  currentSubAnalysis: state.analysis.currentSubAnalysis,
  currentSubAnalysisTitle: state.analysis.currentSubAnalysisTitle,
  expanded: state.sidebar.expanded,
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
  onPickSubAnalysis: (subAnalysis, subAnalysisTitle) =>
    dispatch({
      type: 'SUBANALYSIS_SELECT',
      subAnalysis,
      subAnalysisTitle,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisHomePage);
