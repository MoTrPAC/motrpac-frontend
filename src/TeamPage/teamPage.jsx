import React from 'react';
import { connect } from 'react-redux';
import TeamMemberCard from './teamMemberCard';
import teamInfo from '../lib/teamInfo';

/**
 * The team page, includes all team members listed in the /src/lib/teamInfo.json file.
 * Members seperated by PI's and Staff
 *
 * @returns {Object} Team Page
 */
export function TeamPage({isAuthenticated = false}) {
  const PIs = teamInfo.PIs
    .map(pi => <TeamMemberCard key={pi.name} memberInfo={pi} />);
  const staff = teamInfo.Staff
    .map(member => <TeamMemberCard key={member.name} memberInfo={member} />);
  return (
    <div className={`teamPage col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 `}>
      <div className="row mt-4 justify-content-center">
        <div className="col-12 col-sm-8">
          <h2 className="light">
            The Bioinformatics Center Team
          </h2>
        </div>
      </div>
      <div className="row mt-2 justify-content-center">
        {PIs}
      </div>
      <div className="row mt-4 pb-4 justify-content-center px-md-5">
        {staff}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(TeamPage);
