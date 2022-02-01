import React from 'react';
import PropTypes from 'prop-types';

/**
 * Individual card for a team member, displays on team page.
 * @param {Object} memberInfo general information for a given team member
 *
 * @returns {Objcet} JSX representation of a team member
 */
function TeamMemberCard({ memberInfo, isAuthenticated }) {
  return (
    <div
      className={`teamMember col-lg-4 mb-4 text-center ${
        isAuthenticated ? 'col-xl-3' : ''
      }`}
    >
      <div className="col d-flex mb-3 justify-content-center">
        <div
          className="teamMemberImage"
          style={{ backgroundImage: `url(${memberInfo.image})` }}
        />
      </div>
      <div className="col">
        <h6>{memberInfo.name}</h6>
        <p>{memberInfo.title}</p>
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
  isAuthenticated: PropTypes.bool.isRequired,
};

export default TeamMemberCard;
