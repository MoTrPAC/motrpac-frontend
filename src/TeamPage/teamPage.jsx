import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TeamMemberCard from './teamMemberCard';
import teamInfo from '../lib/teamInfo';

/**
 * The team page, includes all team members listed in the /src/lib/teamInfo.json file.
 * Members seperated by Principal Investigators, Staff and Co-Investigators
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 *
 * @returns {Object} JSX representation of the Team page.
 */
export function TeamPage({ isAuthenticated }) {
  const PIs = teamInfo.PIs
    .map(pi => <TeamMemberCard key={pi.name} memberInfo={pi} />);
  const staff = teamInfo.Staff
    .map(member => <TeamMemberCard key={member.name} memberInfo={member} />);
  const CoIs = teamInfo.CoIs
    .map(coi => <TeamMemberCard key={coi.name} memberInfo={coi} />);
  return (
    <div className={`teamPage col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4`}>
      <div className={`${!isAuthenticated ? 'container' : ''}`}>
        <div className="page-title">
          <h3>
            The Bioinformatics Center Team
          </h3>
        </div>
        <div className="row d-flex justify-content-center">
          {PIs}
        </div>
        <div className="row">
          {staff}
        </div>
        <div className="row">
          {CoIs}
        </div>
      </div>
    </div>
  );
}

TeamPage.propTypes = {
  isAuthenticated: PropTypes.bool,
};

TeamPage.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(TeamPage);
