import React from 'react';
import TeamMemberCard from './teamMemberCard';
import teamInfo from '../assets/teamInfo';

function TeamPage() {
  const PIs = teamInfo.PIs.map(pi => <TeamMemberCard memberInfo={pi} />);
  const SDs = teamInfo.SoftwareDevs.map(sd => <TeamMemberCard memberInfo={sd} />) 
  const BIs= teamInfo.Bioinfo.map(bi => <TeamMemberCard memberInfo={bi} />) 
  return (
    <div className="teamPage container-fluid">
      <div className="row mt-2 justify-content-center">
        <div className="col-12 col-sm-10">
          <h2 className="light">
            The Bioinformatics Center Team
          </h2>
        </div>
      </div>
      <div className="row mt-2 justify-content-center">
        {PIs}
      </div>
      <div className="row mt-4 pb-4 ">
        {SDs}
        {BIs}
      </div>
    </div>
  );
}

export default TeamPage;
