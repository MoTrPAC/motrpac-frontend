import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
import BrowseDataActions from '../BrowseDataPage/browseDataActions';
import PASS1B06TimeCourse from '../assets/figures/pass1b-06-time-course.png';
import PASS1B06Profiling from '../assets/figures/pass1b-06-molecular-profiling.svg';
import ToggleShowHide from './components/toggleShowHide';
import ExternalLink from '../lib/ui/externalLink';

function MainStudy({ profile, allFiles, handleDataFetch }) {
  const [showSummary, setShowSummary] = useState(true);
  const [showExpDesign, setShowExpDesign] = useState(true);
  const [showTissueProfiling, setShowTissueProfiling] = useState(true);

  const userType = profile.user_metadata && profile.user_metadata.userType;

  // post request to fetch data files when download nav link is clicked
  const handleDataObjectFetch = () => {
    if (!allFiles.length) {
      if (userType && userType === 'internal') {
        handleDataFetch();
      } else {
        handleDataFetch('PASS1B-06');
      }
    }
  };

  // Event handlers for show/hide sectional content
  const toggleShowSummary = (e) => {
    e.preventDefault();
    setShowSummary(!showSummary);
  };

  const toggleShowExpDesign = (e) => {
    e.preventDefault();
    setShowExpDesign(!showExpDesign);
  };

  const toggleShowTissueProfiling = (e) => {
    e.preventDefault();
    setShowTissueProfiling(!showTissueProfiling);
  };

  return (
    <div className="mainStudyPage px-3 px-md-4 mb-3 container">
      <PageTitle title="MoTrPAC Project Overview" />
      <div className="main-study-container">
        <div className="main-study-content-container project-overview mt-5">
          <div className="d-flex align-items-center">
            <h3>Summary of MoTrPAC Studies</h3>
            <ToggleShowHide
              icon={showSummary ? 'expand_less' : 'expand_more'}
              toggleState={(e) => toggleShowSummary(e)}
              toggleTarget="project-overview-study-table"
            />
          </div>
          <p>
            The MoTrPAC study is divided into two main parts - animal (rats) and
            human, with multiple phases or interventions in each of them.
            Preclinical animal study sites conduct the endurance exercise and
            training intervention in rats, while Clinical study sites conduct
            the human endurance and resistance training interventions.
          </p>
          <div
            className="table-responsive collapse show"
            id="project-overview-study-table"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">
                    <h4>Animals (Rats)</h4>
                    <div className="subhead">
                      Preclinical animal study sites
                    </div>
                  </th>
                  <th scope="col">
                    <h4>Humans</h4>
                    <div className="subhead">Clinical study sites</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Young adult (6 month old)</strong>
                    <ul>
                      <li>Acute exercise</li>
                      <li>
                        <span className="intervention-title">
                          <a
                            className="anchorjs-link"
                            aria-label="Anchor"
                            href="#endurance-training"
                          >
                            Endurance training
                          </a>
                        </span>
                      </li>
                      <li>Controls</li>
                    </ul>
                    <strong>Middle-aged adult (18 month old)</strong>
                    <ul>
                      <li>Acute exercise</li>
                      <li>Endurance training</li>
                      <li>Controls</li>
                    </ul>
                  </td>
                  <td>
                    <strong>Pediatric</strong>
                    <ul>
                      <li>Endurance training</li>
                      <li>Acute exercise</li>
                      <li>Control</li>
                    </ul>
                    <strong>Adult</strong>
                    <ul>
                      <li>Acute endurance exercise</li>
                      <li>Acute resistance exercise</li>
                      <li>Endurance training</li>
                      <li>Resistance training</li>
                      <li>Control</li>
                    </ul>
                    <strong>Highly active adult</strong>
                    <ul>
                      <li>Acute endurance exercise</li>
                      <li>Acute resistance exercise</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="main-study-content-container endurance-training mt-5"
          id="endurance-training"
        >
          <h3>Endurance Training in Young Adult Rats</h3>
          <h6>
            Species: <span className="font-italic">Rattus norvegicus</span>
          </h6>
          <p>
            In this intervention, we're specifically interested in the long term
            lasting adaptive training effects, independent of acute exercise
            effects, using rats as our model organism. Data from rats provides
            the opportunity to measure tens of thousands of biomolecules in many
            tissues. Rats were endurance-exercise trained on treadmills and
            tissue samples were collected at either 1, 2, 4, or 8 weeks of
            training, with a 48 hour rest or wash out period before samples were
            collected. See the{' '}
            <ExternalLink
              to="http://study-docs.motrpac-data.org/Animal_Protocol.pdf"
              label="animal protocol"
            />{' '}
            to learn more.
          </p>
          <div className="main-study-content-container mt-5">
            <div className="d-flex align-items-center sub-section-title">
              <h5>Experimental Design</h5>
              <ToggleShowHide
                icon={showExpDesign ? 'expand_less' : 'expand_more'}
                toggleState={(e) => toggleShowExpDesign(e)}
                toggleTarget="project-overview-experiment-design"
              />
            </div>
            <div
              className="study-figure border collapse show"
              id="project-overview-experiment-design"
            >
              <img
                src={PASS1B06TimeCourse}
                alt="Endurance Exercise Time Course Intervention"
              />
            </div>
          </div>
          <div className="main-study-content-container mt-5">
            <div className="d-flex align-items-center sub-section-title">
              <h5>Tissues / Molecular Profiling</h5>
              <ToggleShowHide
                icon={showTissueProfiling ? 'expand_less' : 'expand_more'}
                toggleState={(e) => toggleShowTissueProfiling(e)}
                toggleTarget="project-overview-tissue-profiling"
              />
            </div>
            <div
              className="tissue-profiling-figure collapse show"
              id="project-overview-tissue-profiling"
            >
              <p>
                For each time point, we profiled the temporal transcriptome,
                proteome, metabolome, lipidome, phosphoproteome, acetylproteome,
                ubiquitylproteome, epigenome, and immunome in whole blood,
                plasma and 18 solid tissues in Rattus norvegicus over the 8
                weeks of endurance exercise training. The figure shows the
                specific molecular profiling performed on every tissue. For
                example, in liver we run all the available assays for the 4
                exercise time points and the control. For blood, however, we
                only perform transcriptomics (rna-seq).
              </p>
              <img
                src={PASS1B06Profiling}
                className="mb-2"
                alt="Endurance Exercise Tissues / Molecular Profiling"
              />
            </div>
            <div className="data-download-button-container my-5">
              <Link
                className="btn btn-primary"
                to="/data-download"
                role="button"
                onClick={handleDataObjectFetch}
              >
                Download Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MainStudy.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      hasAccess: PropTypes.bool,
      userType: PropTypes.string,
    }),
  }),
  handleDataFetch: PropTypes.func,
};

MainStudy.defaultProps = {
  profile: {},
  handleDataFetch: null,
};

const mapStateToProps = (state) => ({
  allFiles: state.browseData.allFiles,
});

const mapDispatchToProps = (dispatch) => ({
  handleDataFetch: (phase) =>
    dispatch(BrowseDataActions.handleDataFetch(phase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainStudy);
