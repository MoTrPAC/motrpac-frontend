import React from 'react';
import PropTypes from 'prop-types';

/**
 * Individual card for a team member, displays on team page.
 * @param {Object} memberInfo general information for a given team member
 *
 * @returns {Objcet} JSX representation of a team member
 */
function TeamMemberCard({
  memberInfo,
}) {
  return (
    <div className="teamMember col-10 col-sm-6 col-md-4 mt-4">
      <div className="row">
        <div className="col-auto">
          <div className="teamMemberImage" style={{ backgroundImage: `url(${memberInfo.image})` }} />
        </div>
        <div className="col">
          <h3>{memberInfo.name}</h3>
          <h4>{memberInfo.title}</h4>
        </div>
      </div>
    </div>
  );
}

TeamMemberCard.propTypes = {
  memberInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string,
  }).isRequired,
}

export default TeamMemberCard;
