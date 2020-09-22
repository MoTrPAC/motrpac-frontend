import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthContentContainer from '../lib/ui/authContentContainer';
import ReleasedSampleTable from '../Widgets/releasedSampleTable';
import ReleasedSamplePlot from '../Widgets/releasedSamplePlot';
import ReleasedSampleHighlight from '../Widgets/releasedSampleHighlight';
import ReleasedSampleSummary from '../Widgets/releasedSampleSummary';
import PlotControls from '../Widgets/plotControls';
import TableControls from '../Widgets/tableControls';
import dashboardActions from './dashboardActions';

const animalReleaseSamples = require('../data/animal_release_samples');

/**
 * Renders the Dashboard page.
 *
 * @param {Array}     previousUploads Redux state for user's historic uploads.
 * @param {Boolean}   isPending       Redux state for authentication status.
 * @param {Function}  clearForm       Redux upload action.
 *
 * @returns {object} JSX representation of the global footer.
 */
export function Dashboard({
  profile,
  expanded,
  release,
  phase,
  plot,
  sort,
  toggleRelease,
  togglePhase,
  togglePlot,
  toggleSort,
}) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  const sampleData = () => {
    let data = animalReleaseSamples.internal.pass1a_06;
    if (release === 'internal' && phase === 'pass1a_06') {
      data = animalReleaseSamples.internal.pass1a_06;
    } else if (release === 'internal' && phase === 'pass1b_06') {
      data = animalReleaseSamples.internal.pass1b_06;
    } else if (release === 'external' && phase === 'pass1a_06') {
      data = animalReleaseSamples.external.pass1a_06;
    }
    return data;
  };

  return (
    <AuthContentContainer classes="Dashboard" expanded={expanded}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3>Summary of Animal Study Samples</h3>
        </div>
        {userType === 'internal' && (
          <div className="btn-toolbar">
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
                disabled={phase === 'pass1b_06'}
              >
                External Release
              </button>
            </div>
            <div className="btn-group ml-2">
              <button
                type="button"
                className={`btn btn-sm btn-outline-primary ${
                  phase === 'pass1a_06' ? 'active' : ''
                }`}
                onClick={togglePhase.bind(this, 'pass1a_06')}
              >
                PASS1A 6-Month
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline-primary ${
                  phase === 'pass1b_06' ? 'active' : ''
                }`}
                onClick={togglePhase.bind(this, 'pass1b_06')}
                disabled={release === 'external'}
              >
                PASS1B 6-Month
              </button>
            </div>
          </div>
        )}
      </div>
      <ReleasedSampleHighlight data={sampleData()} />
      <div className="card-container-release-samples row mb-2">
        <div className="d-flex col-lg-9">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              {userType === 'internal' && (
                <div className="internal-user-labels float-right">
                  {release === 'internal' && (
                    <span className="badge badge-success ml-3">
                      Internal Release
                    </span>
                  )}
                  {release === 'external' && (
                    <span className="badge badge-warning ml-3">
                      External Release
                    </span>
                  )}
                  {phase === 'pass1a_06' && (
                    <span className="badge badge-secondary ml-2">
                      PASS1A 6-Month
                    </span>
                  )}
                  {phase === 'pass1b_06' && (
                    <span className="badge badge-secondary ml-2">
                      PASS1B 6-Month
                    </span>
                  )}
                </div>
              )}
              {userType === 'external' && (
                <div className="external-user-labels float-right">
                  <span className="badge badge-secondary">PASS1A 6-Month</span>
                </div>
              )}
              <div className="card-title mb-0">Overview</div>
            </h5>
            <div className="card-body pt-1">
              <div className="release-sample-plot border-bottom pb-4 mb-4">
                <PlotControls togglePlot={togglePlot} plot={plot} />
                <ReleasedSamplePlot data={sampleData()} plot={plot} />
              </div>
              <div className="release-sample-table">
                <TableControls toggleSort={toggleSort} sort={sort} />
                <ReleasedSampleTable data={sampleData()} sort={sort} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-lg-3">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="card-title mb-0">Total Samples</div>
            </h5>
            <div className="card-body">
              <ReleasedSampleSummary
                data={animalReleaseSamples}
                release={release}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthContentContainer>
  );
}

Dashboard.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  expanded: PropTypes.bool,
  release: PropTypes.string,
  phase: PropTypes.string,
  plot: PropTypes.string,
  sort: PropTypes.string,
  toggleRelease: PropTypes.func.isRequired,
  togglePhase: PropTypes.func.isRequired,
  togglePlot: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  profile: {},
  expanded: false,
  release: 'internal',
  phase: 'pass1a_06',
  plot: 'tissue_name',
  sort: 'default',
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
  expanded: state.sidebar.expanded,
  ...state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  toggleRelease: (release) => dispatch(dashboardActions.toggleRelease(release)),
  togglePhase: (phase) => dispatch(dashboardActions.togglePhase(phase)),
  togglePlot: (plot) => dispatch(dashboardActions.togglePlot(plot)),
  toggleSort: (sort) => dispatch(dashboardActions.toggleSort(sort)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
