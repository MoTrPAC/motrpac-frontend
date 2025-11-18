import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import PlotControls from '../Widgets/plotControls';
import ReleasedSampleHighlight from '../Widgets/releasedSampleHighlight';
import ReleasedSamplePlot from '../Widgets/releasedSamplePlot';
import ReleasedSampleSummary from '../Widgets/releasedSampleSummary';
import ReleasedSampleTable from '../Widgets/releasedSampleTable';
import TableControls from '../Widgets/tableControls';
import DataSummaryPageActions from './dataSummaryPageActions';

import '@styles/dataSummaryPage.scss';

import animalReleaseSamples from '../data/animal_release_samples.json';

/**
 * Renders the release samples summary page.
 *
 * @param {Object} profile          Redux state of authenticated user profile
 * @param {String} release          Redux state of user-selected release
 * @param {String} phase            Redux state of user-selected phase
 * @param {String} plot             Redux state of plot selection
 * @param {String} sort             Redux state of table sort
 * @param {Boolean} showQC          Redux state of QC sample visibility
 * @param {Function} toggleRelease  Redux action to change release state
 * @param {Function} togglePhase    Redux action to change phase state
 * @param {Function} togglePlot     Redux action to change plot state
 * @param {Function} toggleSort     Redux action to change sort state
 * @param {Function} toggleQC       Redux action to change visibility state
 *
 * @returns {object} JSX representation of the release samples summary
 */
/**
 * Renders the release samples summary page
 *
 * @returns {object} JSX representation of the release samples summary page
 */
export function DataSummaryPage({
  profile = {},
  release = 'internal',
  phase = 'pass1b_06',
  plot = 'tissue_name',
  sort = 'default',
  showQC = true,
  toggleRelease,
  togglePhase,
  togglePlot,
  toggleSort,
  toggleQC,
}) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Returns a subset of the release sample data based on a number of factors:
  // internal or external, user's selection of release/phase
  const sampleData = () => {
    let data = animalReleaseSamples.external.pass1b_06;

    if (userType === 'internal') {
      if (release === 'internal' && phase === 'pass1a_06') {
        data = animalReleaseSamples.internal.pass1a_06;
      } else if (release === 'external' && phase === 'pass1a_06') {
        data = animalReleaseSamples.external.pass1a_06;
      } else if (release.match(/internal|external/) && phase === 'pass1b_06') {
        data = animalReleaseSamples.external.pass1b_06;
      }
    }

    if (userType === 'external') {
      if (phase === 'pass1a_06') {
        data = animalReleaseSamples.external.pass1a_06;
      } else if (phase === 'pass1b_06') {
        data = animalReleaseSamples.external.pass1b_06;
      }
    }

    return data;
  };

  return (
    <div className="dataSummaryPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>Sample Summary - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 page-header">
        <div className="page-title">
          <h1 className="mb-0">
            Summary of Study Assays{' '}
            <small className="text-muted">Young Adult Rats (6 months)</small>
          </h1>
        </div>
        <div className="btn-toolbar">
          {userType === 'internal' && (
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm btn-outline-primary ${
                  release === 'internal' ? 'active' : ''
                }`}
                onClick={toggleRelease.bind(this, 'internal')}
              >
                Internal Release
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline-primary ${
                  release === 'external' ? 'active' : ''
                }`}
                onClick={toggleRelease.bind(this, 'external')}
              >
                External Release
              </button>
            </div>
          )}
          <div className="btn-group ml-2">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${
                phase === 'pass1b_06' ? 'active' : ''
              }`}
              onClick={togglePhase.bind(this, 'pass1b_06')}
            >
              Endurance Exercise Training
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${
                phase === 'pass1a_06' ? 'active' : ''
              }`}
              onClick={togglePhase.bind(this, 'pass1a_06')}
            >
              Acute Exercise Training
            </button>
          </div>
        </div>
      </div>
      <ReleasedSampleHighlight data={sampleData()} />
      <div className="card-container-release-samples row mb-2">
        <div className="d-flex col-lg-9">
          <div className="flex-fill w-100 card shadow-sm">
            <h4 className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Overview</div>
              <div className="user-phase-labels">
                {release === 'internal' && userType === 'internal' && (
                  <span className="badge badge-success mr-2">
                    Internal Release
                  </span>
                )}
                {release === 'external' && userType === 'internal' && (
                  <span className="badge badge-warning mr-2">
                    External Release
                  </span>
                )}
                {phase === 'pass1a_06' && (
                  <span className="badge badge-secondary">
                    Acute Exercise Training (Limited)
                  </span>
                )}
                {phase === 'pass1b_06' && (
                  <span className="badge badge-secondary">
                    Endurance Exercise Training
                  </span>
                )}
              </div>
            </h4>
            <div className="card-body pt-1">
              <div className="release-sample-plot border-bottom pb-4 mb-4">
                <PlotControls togglePlot={togglePlot} plot={plot} />
                <ReleasedSamplePlot data={sampleData()} plot={plot} />
              </div>
              <div className="release-sample-table">
                <TableControls
                  toggleSort={toggleSort}
                  sort={sort}
                  toggleQC={toggleQC}
                  showQC={showQC}
                />
                <ReleasedSampleTable
                  data={sampleData()}
                  sort={sort}
                  showQC={showQC}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-lg-3">
          <div className="flex-fill w-100 card shadow-sm">
            <div className="card-body">
              <ReleasedSampleSummary
                data={animalReleaseSamples}
                release={release}
                userType={userType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DataSummaryPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  release: PropTypes.string,
  phase: PropTypes.string,
  plot: PropTypes.string,
  sort: PropTypes.string,
  showQC: PropTypes.bool,
  toggleRelease: PropTypes.func.isRequired,
  togglePhase: PropTypes.func.isRequired,
  togglePlot: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
  toggleQC: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.dataSummary,
});

const mapDispatchToProps = (dispatch) => ({
  toggleRelease: (release) =>
    dispatch(DataSummaryPageActions.toggleRelease(release)),
  togglePhase: (phase) => dispatch(DataSummaryPageActions.togglePhase(phase)),
  togglePlot: (plot) => dispatch(DataSummaryPageActions.togglePlot(plot)),
  toggleSort: (sort) => dispatch(DataSummaryPageActions.toggleSort(sort)),
  toggleQC: (visible) => dispatch(DataSummaryPageActions.toggleQC(visible)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataSummaryPage);
