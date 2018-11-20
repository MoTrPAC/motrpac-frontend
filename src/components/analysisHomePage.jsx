import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import globeIcon from '../assets/analysisIcons/Globe.png';
import moleculeIcon from '../assets/analysisIcons/Molecule.png';
import lungIcon from '../assets/analysisIcons/Lungs.png';
import networkIcon from '../assets/analysisIcons/Network.png';
import timeIcon from '../assets/analysisIcons/TimeSeries.png';
import omicsIcon from '../assets/analysisIcons/Omics.png';

const analysisTypes = [
  {
    title: 'Published Data Meta-Analysis',
    shortName: 'PDMA',
    icon: globeIcon,
  },
  {
    title: 'Differential Molecules',
    shortName: 'DM',
    icon: moleculeIcon,
  },
  {
    title: 'Tissue Comparison',
    shortName: 'TC',
    icon: lungIcon,
  },
  {
    title: 'Network Analysis',
    shortName: 'NA',
    icon: networkIcon,
  },
  {
    title: 'Time Course Visualization',
    shortName: 'TCV',
    icon: timeIcon,
  },
  {
    title: 'Omics Comparison',
    shortName: 'OC',
    icon: omicsIcon,
  },
];

export function AnalysisHomePage({ match, depth, currentAnalysis, onPickAnalysis, goBack}) {
  function pickAnalysis(e) {
    onPickAnalysis(e);
  }
  let subjectType = match.params.subjectType.slice(0).toLowerCase();

  // Redirects to dashboard if incorrect url
  if (!(subjectType === 'animal' || subjectType === 'human')) {
    return <Redirect to="/dashboard" />;
  }
  const threeAnalyses = analysisTypes.slice(0, 3)
    .map(analysisType => <AnalysisTypeButton key={analysisType.shortName} onPickAnalysis={pickAnalysis} analysisType={analysisType} />);
  const nextThreeAnalyses = analysisTypes.slice(3)
    .map(analysisType => <AnalysisTypeButton key={analysisType.shortName} onPickAnalysis={pickAnalysis} analysisType={analysisType} />);
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
          {(depth > 0) ? <BackButton goBack={goBack} /> : ''}
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
};

function AnalysisTypeButton({ analysisType, onPickAnalysis }) {
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
  onPickAnalysis: PropTypes.func.isRequired,
};

function BackButton({ goBack }) {
  return <button onClick={goBack} type="button"><span className="oi backButton oi-arrow-thick-left" /></button>
}
BackButton.propTypes = {
  goBack: PropTypes.func.isRequired,
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
