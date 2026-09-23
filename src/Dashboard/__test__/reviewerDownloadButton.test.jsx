import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ReviewerDownloadButton from '../reviewerDownloadButton';
import { setReviewerAgreement } from '../../lib/userAccess';

vi.mock('axios');

const profile = { userid: 'auth0|reviewer', user_metadata: { userType: 'external' } };

function renderButton({ disabled = false } = {}) {
  return render(
    <ReviewerDownloadButton
      filename="bundles/motrpac_human-precovid-sed-adu_analysis.zip"
      label="Analysis R Package"
      profile={profile}
      disabled={disabled}
    />
  );
}

describe('ReviewerDownloadButton - the data use agreement gates the fetch', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_SERVICE_ADDRESS', 'https://api.example');
    vi.stubEnv('VITE_SIGNED_URL_ENDPOINT', '/signed-url');
    vi.stubEnv('VITE_API_SERVICE_KEY', 'test-key');
    vi.stubEnv('VITE_DATA_FILE_BUCKET', 'test-bucket');
    axios.get = vi.fn().mockResolvedValue({ data: { url: 'https://signed.example/pkg.zip' } });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('a declined agreement blocks the request even with the button enabled', () => {
    // Rendered enabled on purpose. A disabled button never fires its onClick,
    // so asserting against one proves nothing about the handler -- it passes
    // with no guard at all. The case worth covering is the control being
    // enabled while the answer is still no: the devtools click, or a future
    // caller that forgets the prop.
    setReviewerAgreement(false);
    renderButton({ disabled: false });

    fireEvent.click(screen.getByRole('button', { name: /analysis r package/i }));

    expect(axios.get).not.toHaveBeenCalled();
  });

  test('and the button still renders disabled, so it is not reachable by accident', () => {
    setReviewerAgreement(false);
    renderButton({ disabled: true });

    expect(screen.getByRole('button', { name: /analysis r package/i })).toBeDisabled();
  });

  test('never having answered blocks it too', () => {
    renderButton();

    fireEvent.click(screen.getByRole('button', { name: /analysis r package/i }));

    expect(axios.get).not.toHaveBeenCalled();
  });

  test('an accepted agreement lets the request through', async () => {
    setReviewerAgreement(true);
    renderButton();

    fireEvent.click(screen.getByRole('button', { name: /analysis r package/i }));

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get.mock.calls[0][0]).toContain(
      'motrpac_human-precovid-sed-adu_analysis.zip'
    );
  });
});
