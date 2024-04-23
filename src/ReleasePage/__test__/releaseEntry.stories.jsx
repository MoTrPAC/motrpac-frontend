import React from 'react';
import { storiesOf } from '@storybook/react';
import ReleaseEntry from '../releaseEntry';

import internalUser from '../../testData/testUser';

const externalUser = {
  ...internalUser,
  user_metadata: {
    name: 'Test User',
    givenName: 'TestUser',
    siteName: 'Stanford',
    hasAccess: true,
    userType: 'external',
  },
};

const internalLoggedInState = {
  currentView: 'internal',
  profile: internalUser,
};

const externalLoggedInState = {
  currentView: 'external',
  profile: externalUser,
};

storiesOf('Release Entry', module)
  .addDecorator(story => (
    <div className="dataReleasePage container-fluid">
      {story()}
    </div>
  ))
  .add('Internal user view', () => (
    <ReleaseEntry {...internalLoggedInState} />
  ))
  .add('External user view', () => (
    <ReleaseEntry {...externalLoggedInState} />
  ));
