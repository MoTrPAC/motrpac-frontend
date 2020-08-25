import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PreviousUploadsTableConnected, {
  PreviousUploadsTable,
} from '../Widgets/previousUploadsTable';
import PreviousUploadsGraph from '../Widgets/previousUploadsGraph';
import AllUploadsDoughnut from '../Widgets/allUploadsDoughnut';
import AllUploadStats from '../Widgets/allUploadStats';
import actions from '../UploadPage/uploadActions';
import AuthContentContainer from '../lib/ui/authContentContainer';

const allUploads = require('../testData/testAllUploads');

/**
 * Renders the Dashboard page.
 *
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status.
 * @param {Boolean}   isPending       Redux state for user's authentication progress.
 * @param {Object}    profile         Redux state for authenticated user's info.
 *
 * @returns {object} JSX representation of the global footer.
 */
export function Dashboard({
  profile,
  isAuthenticated,
  isPending,
  featureAvailable,
  previousUploads,
  disconnectComponents,
  clearForm,
  expanded,
}) {
  const editBtn = (
    <div className="col-auto">
      <Link className="editBtn btn btn-light disabled" to="/edit-dashboard">
        Edit Dashboard
      </Link>
    </div>
  );

  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  // FIXME: temp workaround to handle callback redirect
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
      return <Redirect to="/error" />;
    }

    return (
      <AuthContentContainer classes="Dashboard" expanded={expanded}>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <div className="page-title">
            <h3>Dashboard</h3>
          </div>
          <div className="btn-toolbar">
            <div className="btn-group">
              <Link
                className="uploadBtn btn btn-sm btn-outline-primary"
                to="/upload"
                onClick={clearForm}
              >
                Upload Data
              </Link>
              <Link
                className="downloadBtn btn btn-sm btn-outline-primary"
                to="/download"
              >
                Download/View Data
              </Link>
            </div>
          </div>
          {featureAvailable.dashboardEditable ? editBtn : ''}
        </div>
        <div className="previous-uploads-table">
          <div className="card">
            <h5 className="card-header">Uploads</h5>
            <div className="card-body">
              {disconnectComponents ? (
                <PreviousUploadsTable previousUploads={previousUploads} />
              ) : (
                <PreviousUploadsTableConnected />
              )}
            </div>
          </div>
        </div>
        <div className="previous-uploads-graph">
          <div className="card">
            <h5 className="card-header">Assay Categories</h5>
            <div className="card-body">
              <PreviousUploadsGraph previousUploads={previousUploads} />
            </div>
          </div>
        </div>
        <div className="total-uploads-graph">
          <div className="card">
            <h5 className="card-header">Total Uploads By All Sites</h5>
            <div className="card-body">
              <div className="row justify-content-center">
                <AllUploadsDoughnut allUploads={allUploads} />
                <AllUploadStats />
              </div>
            </div>
          </div>
        </div>
      </AuthContentContainer>
    );
  }

  return <Redirect to="/" />;
}

Dashboard.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  isPending: PropTypes.bool,
  featureAvailable: PropTypes.shape({
    dashboardEditable: PropTypes.bool,
  }),
  previousUploads: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string,
    })
  ).isRequired,
  disconnectComponents: PropTypes.bool,
  clearForm: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

Dashboard.defaultProps = {
  profile: {},
  isAuthenticated: false,
  isPending: false,
  featureAvailable: {
    dashboardEditable: false,
  },
  disconnectComponents: false,
  expanded: false,
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  isPending: state.auth.isPending,
  previousUploads: state.upload.previousUploads,
  expanded: state.sidebar.expanded,
});

// Need to clear the upload form values and recently uploaded files
// if user navigates away from and returns to the upload page
const mapDispatchToProps = (dispatch) => ({
  clearForm: () => dispatch(actions.clearForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
