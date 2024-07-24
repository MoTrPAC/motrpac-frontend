import React from 'react';
import TeamMemberCard from '../teamMemberCard';
import teamInfo from '../../lib/teamInfo';

const oneMember = teamInfo.PIs[0];

export default {
  title: 'Team Member Card',

  decorators: [
    (story) => (
      <div className="container-fluid teamPage">
        <div className="row">{story()}</div>
      </div>
    ),
  ],
};

export const Default = () => (
  <TeamMemberCard
    image="https://via.placeholder.com/150"
    memberInfo={oneMember}
  />
);
