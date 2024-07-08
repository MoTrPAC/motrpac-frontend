import React from 'react';
import PageTitle from '../lib/ui/pageTitle';
import TeamMemberCard from './teamMemberCard';
import teamInfo from '../lib/teamInfo';

import '@styles/teamPage.scss';

/**
 * The team page, includes all team members listed in the /src/lib/teamInfo.json file.
 * Members seperated by Principal Investigators, Staff and Co-Investigators
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Boolean} expanded        Redux state for sidebar
 *
 * @returns {Object} JSX representation of the Team page.
 */
function TeamPage() {
  const PIs = teamInfo.PIs.map((pi) => (
    <TeamMemberCard key={pi.name} memberInfo={pi} />
  ));
  const staff = teamInfo.Staff.map((member) => (
    <TeamMemberCard key={member.name} memberInfo={member} />
  ));
  const CoIs = teamInfo.CoIs.map((coi) => (
    <TeamMemberCard key={coi.name} memberInfo={coi} />
  ));
  const Alumni = teamInfo.Alumni.map((alumni) => (
    <TeamMemberCard key={alumni.name} memberInfo={alumni} />
  ));

  const pageContent = (
    <>
      <div className="row d-flex justify-content-center">{PIs}</div>
      <div className="row">{staff}</div>
      <div className="row">{CoIs}</div>
      <div className="row pt-5 pb-0 border-top">{Alumni}</div>
    </>
  );

  return (
    <div className="teamPage px-3 px-md-4 mb-3 container">
      <PageTitle title="MoTrPAC Bioinformatics Center Team" />
      <div>{pageContent}</div>
      <div className="pt-5 pb-0 mb-5 border-top text-center">
        <h5>
          <a
            href="https://motrpac.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="external-link-text">
              Learn more about the Molecular Transducers of Physical Activity
              Consortium
            </span>{' '}
            <span className="oi oi-external-link" />
          </a>
        </h5>
      </div>
    </div>
  );
}

export default TeamPage;
