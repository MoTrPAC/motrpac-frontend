import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TeamMemberCard from './teamMemberCard';
import teamInfo from '../lib/teamInfo';
import AuthContentContainer from '../lib/ui/authContentContainer';

/**
 * The team page, includes all team members listed in the /src/lib/teamInfo.json file.
 * Members seperated by Principal Investigators, Staff and Co-Investigators
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Boolean} expanded        Redux state for sidebar
 *
 * @returns {Object} JSX representation of the Team page.
 */
export function TeamPage({ isAuthenticated, expanded }) {
  const PIs = teamInfo.PIs.map((pi) => (
    <TeamMemberCard
      key={pi.name}
      memberInfo={pi}
      isAuthenticated={isAuthenticated}
    />
  ));
  const staff = teamInfo.Staff.map((member) => (
    <TeamMemberCard
      key={member.name}
      memberInfo={member}
      isAuthenticated={isAuthenticated}
    />
  ));
  const CoIs = teamInfo.CoIs.map((coi) => (
    <TeamMemberCard
      key={coi.name}
      memberInfo={coi}
      isAuthenticated={isAuthenticated}
    />
  ));
  const Alumni = teamInfo.Alumni.map((alumni) => (
    <TeamMemberCard
      key={alumni.name}
      memberInfo={alumni}
      isAuthenticated={isAuthenticated}
    />
  ));

  const pageContent = (
    <>
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>MoTrPAC Bioinformatics Center Team</h3>
      </div>
      <div className="row d-flex justify-content-center">{PIs}</div>
      <div className="row">{staff}</div>
      <div className="row">{CoIs}</div>
      <div className="row pt-5 pb-0 border-top">{Alumni}</div>
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className="col-md-9 col-lg-10 px-4 teamPage">
        <div className="container">{pageContent}</div>
      </div>
    );
  }

  return (
    <AuthContentContainer classes="teamPage" expanded={expanded}>
      <div>{pageContent}</div>
    </AuthContentContainer>
  );
}

TeamPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  expanded: PropTypes.bool,
};

TeamPage.defaultProps = {
  isAuthenticated: false,
  expanded: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  expanded: state.sidebar.expanded,
});

export default connect(mapStateToProps)(TeamPage);
