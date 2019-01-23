import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import analysisTypes from '../lib/analysisTypes';

// TODO: Add animation of transitions potentially with CSSTransitions package

export function AnalysisHomePage({
  match, // match object from react-router used to find human vs animal in route
  isAuthenticated,
  depth,
  currentAnalysis,
  onPickAnalysis,
  onPickSubAnalysis,
  goBack,
}) {
  let subjectType = match.params.subjectType.slice(0).toLowerCase();

  // Redirects to dashboard if incorrect url
  if (!(subjectType === 'animal' || subjectType === 'human') || !isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  // Button to select inital analysis category
  function AnalysisTypeButton({ analysisType }) {
    if (analysisType.active) {
      return (
        <div id={analysisType.shortName} onClick={onPickAnalysis} onKeyPress={onPickAnalysis} tabIndex={0} role="button" className="col-5 col-sm-3 m-3 analysisType analysisTypeActive">
          <p className="centered">{analysisType.title}</p>
          <img src={analysisType.icon} className="align-self-end" alt={`${analysisType.title} Icon`} />
        </div>
      );
    }
    return (
      <div id={analysisType.shortName} className="col-sm-3 col-5 m-3 analysisType inactiveAnalysis">
        <p className="centered">{analysisType.title}</p>
        <img src={analysisType.inactiveIcon} className="align-self-end" alt={`${analysisType.title} Icon`} />
        <div className="comingSoon align-self-center centered">
          <p>Coming Soon!</p>
        </div>
      </div>
    );
  }
  AnalysisTypeButton.propTypes = {
    analysisType: PropTypes.shape({
      title: PropTypes.string,
      shortName: PropTypes.string,
      icon: PropTypes.string,
      subAnalysis: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      })),
    }).isRequired,
  };

  function SubAnalysisButton({ subAnalysis }) {
    if (subAnalysis.active) {
      return (
        <div className="row subAnalysisRow justify-content-center m-1 m-sm-4" onClick={onPickSubAnalysis} onKeyPress={onPickSubAnalysis} tabIndex={0} role="button" id={subAnalysis.shortName}>
          <div className="col-11 col-md-5 m-1 my-2 align-self-center imgCont">
            <img src={subAnalysis.icon} className="align-self-end" alt={`${subAnalysis.title} Icon`} />
          </div>
          <div className="col-11 col-md-5 p-2 align-self-center">
            <h3>{subAnalysis.title}</h3>
            <p>
              <strong>Input: </strong>
              {subAnalysis.input}
            </p>
            <p>
              {subAnalysis.description}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="row subAnalysisRow justify-content-center m-1 m-sm-4 inactiveSubAnalysisRow" id={subAnalysis.shortName}>
        <div className="col-11 col-md-5 m-1 my-2 align-self-center imgCont">
          <img src={subAnalysis.inactiveIcon} className="align-self-end" alt={`${subAnalysis.title} Icon`} />
        </div>
        <div className="col-11 col-md-5 p-2 align-self-center">
          <h3>{subAnalysis.title}</h3>
          <p>
            <strong>Input: </strong>
            {subAnalysis.input}
          </p>
          <p>
            {subAnalysis.description}
          </p>
        </div>
        <div className="comingSoon align-self-center centered">
          <p>Coming Soon!</p>
        </div>
      </div>
    );
  }
  SubAnalysisButton.propTypes = {
    subAnalysis: PropTypes.shape({
      title: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      shortName: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      inactiveIcon: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    }).isRequired,
  };
  // Button to return 1 depth level
  function BackButton() {
    return <button className="backButton btn" onClick={goBack} type="button"><span className="oi backButton oi-arrow-thick-left" /></button>;
  }

  const analyses = analysisTypes
    .map(analysisType => (
      <AnalysisTypeButton
        key={analysisType.shortName}
        analysisType={analysisType}
      />));

  let selectedAnalysis;
  let selectSubAnalyses;
  if (depth === 1 && currentAnalysis) {
    selectedAnalysis = (analysisTypes.filter(analysis => analysis.shortName === currentAnalysis));
    selectSubAnalyses = selectedAnalysis[0].subAnalyses
      .map(analysis => <SubAnalysisButton key={analysis.shortName} subAnalysis={analysis} />);
  }

  const selectAnalysis = (
    <div className="row justify-content-center">
      {analyses}
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
            {`${subjectType} Data Analysis`}
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {(depth > 0) ? <BackButton /> : ''}
        </div>
      </div>
      {(depth === 1) ? selectSubAnalyses : ''}
      {(depth === 0) ? selectAnalysis : ''}
      <div className="row breadcrumbs justify-content-center">
        <div className="col centered">
          <span className={`oi oi-media-record ${depth === 0 ? 'active' : ''}`} />
          <span className={`oi oi-media-record ${depth === 1 ? 'active' : ''}`} />
          <span className={`oi oi-media-record ${depth === 2 ? 'active' : ''}`} />
        </div>
      </div>
    </div>
  );
}

AnalysisHomePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectType: PropTypes.string.isRequired,
    }).isRequired,
  }),
  depth: PropTypes.number.isRequired,
  isAuthenticated: PropTypes.bool,
  currentAnalysis: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  onPickAnalysis: PropTypes.func.isRequired,
  onPickSubAnalysis: PropTypes.func.isRequired,
};
AnalysisHomePage.defaultProps = {
  match: {
    params: {
      subjectType: '',
    },
  },
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  depth: state.analysis.depth,
  currentAnalysis: state.analysis.currentAnalysis,
  isAuthenticated: state.auth.isAuthenticated,
});
const mapDispatchToProps = dispatch => ({
  onPickAnalysis: e => dispatch({
    type: 'ANALYSIS_SELECT',
    analysis: e.currentTarget.id,
  }),
  goBack: () => dispatch({
    type: 'GO_BACK',
  }),
  onPickSubAnalysis: e => dispatch({
    type: 'SUBANALYSIS_SELECT',
    subAnalysis: e.currentTarget.id,
  }),
});


export default connect(mapStateToProps, mapDispatchToProps)(AnalysisHomePage);
