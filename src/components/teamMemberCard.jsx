import React from 'react';

function TeamMemberCard({
  image,
  memberInfo,
}) {
  return (
    <div className="col">
      <h1>{memberInfo.name}</h1>
      <img src={image} alt={`${memberInfo.name}`} />
    </div>
  );
}

export default TeamMemberCard;
