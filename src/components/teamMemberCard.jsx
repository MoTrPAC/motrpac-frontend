import React from 'react';

function TeamMemberCard({
  memberInfo,
}) {
  return (
    <div className="teamMember col-10 col-sm-6 col-md-4 mt-4">
      <div className="row">
        <div className="col-auto">
          <img src={memberInfo.image} alt={`${memberInfo.name}`} />
        </div>
        <div className="col">
          <h3>{memberInfo.name}</h3>
          <h4>{memberInfo.title}</h4>
        </div>
      </div>
    </div>
  );
}

export default TeamMemberCard;
