import React from 'react';
import { storiesOf } from '@storybook/react';
import TeamMemberCard from '../components/teamMemberCard';


const fakeMemberInfo = {
  name: 'TEST',
};

storiesOf('Team Member Card', module)
  .addDecorator(story => <div className="container"><div className="row">{story()}</div></div>)
  .add('default', () => <TeamMemberCard image="https://via.placeholder.com/150" memberInfo={fakeMemberInfo} />);
