import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AuthContentContainer from '../lib/ui/authContentContainer';
import AnimatedLoadingIcon from '../lib/ui/loading';

export function PhenotypePage({
  profile,
  expanded,
}) {
  // Send users to default page if they are not consortium members
  const userType = profile.user_metadata && profile.user_metadata.userType;
  if (userType === 'external') {
    return <Redirect to="/home" />;
  }

  return (
    <AuthContentContainer classes="phenotypePage" expanded={expanded}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3 className="mb-0">Phenotype</h3>
        </div>
      </div>
      <div className="phenotype-container w-100">
        <h5>Pre-COVID Human Extended QC Data</h5>
        <div className="card mb-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm phenotypeTable">
                <thead>
                  <tr className="table-head">
                    <th>File</th>
                    <th>Participants</th>
                    <th>Phase</th>
                    <th>Description</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Adult_dd_extended_qc_redacted.csv</td>
                    <td>Adult</td>
                    <td>Human</td>
                    <td>Data dictionary</td>
                    <td>1.00 MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthContentContainer>
  );
}

PhenotypePage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  expanded: PropTypes.bool,
};

PhenotypePage.defaultProps = {
  profile: {},
  expanded: false,
};

const mapStateToProps = (state) => ({
  ...state.browseData,
  profile: state.auth.profile,
  expanded: state.sidebar.expanded,
});

export default connect(mapStateToProps)(PhenotypePage);
