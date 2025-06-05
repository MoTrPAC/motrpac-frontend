import React from 'react';
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

export default {
  title: 'Release Entry',

  decorators: [
    (story) => <div className="dataReleasePage container-fluid">{story()}</div>,
  ],
};

export const InternalUserView = {
  render: () => <ReleaseEntry {...internalLoggedInState} />,

  name: 'Internal user view',
};

export const ExternalUserView = {
  render: () => <ReleaseEntry {...externalLoggedInState} />,

  name: 'External user view',
};
