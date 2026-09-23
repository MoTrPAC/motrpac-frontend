import { describe, test, expect, beforeEach, vi } from 'vitest';
import { logoutAsync } from '../authActions';
import {
  REVIEWER_AGREEMENT_KEY,
  reviewerAgreementAccepted,
  setReviewerAgreement,
} from '../../lib/userAccess';

// Auth0 would redirect the page; only the ordering around it matters here.
const logout = vi.fn();
vi.mock('../Auth', () => ({
  default: class {
    // eslint-disable-next-line class-methods-use-this
    logout(...args) {
      return logout(...args);
    }
  },
}));

describe('logging out forgets the reviewer data use agreement', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  test('the agreement does not survive a logout', () => {
    // `Auth.logout` empties localStorage, but the agreement is in
    // sessionStorage: without this, a reviewer signing out and a second one
    // signing in on the same tab would find the terms already accepted.
    setReviewerAgreement(true);
    expect(reviewerAgreementAccepted()).toBe(true);

    logoutAsync()(vi.fn());

    expect(reviewerAgreementAccepted()).toBe(false);
    expect(window.sessionStorage.getItem(REVIEWER_AGREEMENT_KEY)).toBeNull();
  });

  test('it is cleared before the redirect, not after', () => {
    // Anything after `auth.logout()` races the navigation to Auth0 and may
    // never run.
    setReviewerAgreement(true);
    let agreementAtRedirect = null;
    logout.mockImplementation(() => {
      agreementAtRedirect = reviewerAgreementAccepted();
    });

    logoutAsync()(vi.fn());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(agreementAtRedirect).toBe(false);
  });

  test('every logout path gets it, because they all dispatch this action', () => {
    // The navbar logs out from three places -- the button, the expiry timer and
    // the `expires_at` storage watcher -- and only the button used to clear the
    // key. All three dispatch `actions.logout`, so clearing here covers them.
    const dispatch = vi.fn();
    setReviewerAgreement(true);

    logoutAsync()(dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(reviewerAgreementAccepted()).toBe(false);
  });
});
