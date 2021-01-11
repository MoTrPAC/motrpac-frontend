import React from 'react';
import { Redirect } from 'react-router-dom';
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
 * @param {Object} profile          Redux state of authenticated user profile
 * @param {Boolean} expanded        Redux state of collapsed/expanded sidebar
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
 * @returns {object} JSX representation of the Dashboard
 */
export function Dashboard({
  profile,
  expanded,
  release,
  phase,
  plot,
  sort,
  showQC,
  toggleRelease,
  togglePhase,
  togglePlot,
  toggleSort,
  toggleQC,
  isAuthenticated,
  isFetching,
  isPending,
}) {
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Returns a subset of the release sample data based on a number of factors:
  // internal or external, user's selection of release/phase
  const sampleData = () => {
    let data =
      userType === 'external'
        ? animalReleaseSamples.external.pass1a_06
        : animalReleaseSamples.internal.pass1a_06;

    if (userType === 'internal') {
      if (release === 'internal' && phase === 'pass1a_06') {
        data = animalReleaseSamples.internal.pass1a_06;
      } else if (release === 'internal' && phase === 'pass1b_06') {
        data = animalReleaseSamples.internal.pass1b_06;
      } else if (release === 'external' && phase === 'pass1a_06') {
        data = animalReleaseSamples.external.pass1a_06;
      }
    }

    return data;
  };

  if (isPending) {
    const pendingMsg = 'Authenticating...';

    return (
      <div className="authLoading">
        <span className="oi oi-shield" />
        <h3>{pendingMsg}</h3>
      </div>
    );
  }

  if (isAuthenticated) {
    if (!hasAccess) {
      return <Redirect to="/error/" />;
    }

    return (
      <AuthContentContainer classes="Dashboard" expanded={expanded}>
        {userType === 'external' && (
          <div className="alert alert-warning alert-dismissible fade show d-flex align-items-center justify-content-between w-100" role="alert">
            <span>
              Please note that the publication embargo on MoTrPAC data has been extended
              until release of additional control data necessary to fully control for
              non-exercise induced molecular changes in the current dataset. The control
              data has been delayed due to the COVID-19 pandemic and we apologize for any
              inconvenience caused. Please be sure that the consortium is hard at work to
              release this data to the scientific community as soon as possible. Until
              then, data can only be used for analyses supporting grant submissions, and
              not be used in abstracts, manuscripts, preprints or presentations.
            </span>
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-header">
          <div className="page-title">
            <h3>Summary of Animal Study Assays</h3>
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
      </AuthContentContainer>
    );
  }

  return (<Redirect to="/" />);
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
  showQC: PropTypes.bool,
  toggleRelease: PropTypes.func.isRequired,
  togglePhase: PropTypes.func.isRequired,
  togglePlot: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
  toggleQC: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isFetching: PropTypes.bool,
  isPending: PropTypes.bool,
};

Dashboard.defaultProps = {
  profile: {},
  expanded: false,
  release: 'internal',
  phase: 'pass1a_06',
  plot: 'tissue_name',
  sort: 'default',
  showQC: true,
  isAuthentiacted: false,
  isFetching: false,
  isPending: false,
};

const mapStateToProps = (state) => ({
   ...state.auth,
  expanded: state.sidebar.expanded,
  ...state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  toggleRelease: (release) => dispatch(dashboardActions.toggleRelease(release)),
  togglePhase: (phase) => dispatch(dashboardActions.togglePhase(phase)),
  togglePlot: (plot) => dispatch(dashboardActions.togglePlot(plot)),
  toggleSort: (sort) => dispatch(dashboardActions.toggleSort(sort)),
  toggleQC: (visible) => dispatch(dashboardActions.toggleQC(visible)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
