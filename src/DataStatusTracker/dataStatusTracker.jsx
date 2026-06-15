import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HumanDataStatus from './humanDataStatus';
import RatDataStatus from './ratDataStatus';
import { RAT_BLURB } from './transformRatStatusData';

import '@styles/dataStatusTracker.scss';

const HUMAN_BLURB =
  'This report is generated using sample shipping records and '
  + 'automated parsing of data submitted to and processed by the BIC.'
  + 'Red indicates data received by the BIC that has not yet been processed '
  + 'or made available to the consortium. Yellow and green indicate data available to '
  + 'the consortium (either early access, consortium release, or public release — not '
  + 'distinguished here).';

/**
 * Renders the Sample Data Tracker page with a Human/Rat toggle.
 * Internal/consortium users only.
 */
export function DataStatusTracker({ profile }) {
  const userType = profile?.user_metadata?.userType;
  const [species, setSpecies] = useState('human');

  if (!profile || userType === 'external') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="dataStatusTrackerPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>Sample Data Tracker - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-2 page-header">
        <div className="page-title">
          <h1 className="mb-0">Sample Data Tracker</h1>
        </div>
      </div>

      <div className="species-toggle btn-group mb-3" role="group" aria-label="Select species">
        <button
          type="button"
          className={`btn ${species === 'human' ? 'btn-primary' : 'btn-outline-primary'}`}
          aria-pressed={species === 'human'}
          onClick={() => setSpecies('human')}
        >
          Human
        </button>
        <button
          type="button"
          className={`btn ${species === 'rat' ? 'btn-primary' : 'btn-outline-primary'}`}
          aria-pressed={species === 'rat'}
          onClick={() => setSpecies('rat')}
        >
          Rat
        </button>
      </div>

      <p>{species === 'human' ? HUMAN_BLURB : RAT_BLURB}</p>

      {species === 'human' ? <HumanDataStatus /> : <RatDataStatus />}
    </div>
  );
}

DataStatusTracker.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(DataStatusTracker);
