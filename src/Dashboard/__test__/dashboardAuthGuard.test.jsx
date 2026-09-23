import { describe, test, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../dashboard';

const reviewer = {
  user_metadata: { userType: 'external', givenName: 'Test', hasAccess: true },
  app_metadata: { role: 'reviewer' },
};

const renderAt = (isAuthenticated, profile = reviewer) => (
  <MemoryRouter>
    <Dashboard
      profile={profile}
      isAuthenticated={isAuthenticated}
      handleQCDataFetch={() => {}}
      lastModified=""
    />
  </MemoryRouter>
);

describe('Dashboard - the sign-in guard', () => {
  test('a session ending while the page is open redirects instead of crashing', () => {
    // The reviewer panel added a useState and a useEffect. With the guard above
    // them, the signed-out render called one hook where the signed-in render
    // called two, and React threw "Rendered fewer hooks than expected" -- a
    // blank page instead of a redirect, for anyone whose session expired here.
    const { rerender } = render(renderAt(true));
    expect(() => rerender(renderAt(false))).not.toThrow();
  });

  test('the same holds when access is revoked rather than the session ending', () => {
    const withoutAccess = {
      ...reviewer,
      user_metadata: { ...reviewer.user_metadata, hasAccess: false },
    };
    const { rerender } = render(renderAt(true));
    expect(() => rerender(renderAt(true, withoutAccess))).not.toThrow();
  });
});
