import { describe, test, expect } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CollectionActionButtons from '../collectionActionButtons';

const bucketName = import.meta.env.VITE_DATA_FILE_BUCKET;
const storageLocation = `gs://${bucketName}/quant-id/rat-training-06/c3.0`;

function renderButtons(userType) {
  return render(
    <CollectionActionButtons storageLocation={storageLocation} userType={userType} />
  );
}

describe('CollectionActionButtons - GCP Storage toggle', () => {
  test('carries a caret so it reads as expanding, not navigating', () => {
    const { container } = renderButtons('internal');
    const icon = container.querySelector('.gcs-toggle .material-icons');

    expect(icon).toBeInTheDocument();
    expect(icon.textContent.trim()).toBe('expand_more');
  });

  test('the caret flips when the path is revealed', () => {
    const { container } = renderButtons('internal');
    const toggle = screen.getByRole('button', { name: /gcp storage/i });

    fireEvent.click(toggle);
    expect(container.querySelector('.gcs-toggle .material-icons').textContent.trim()).toBe(
      'expand_less'
    );
    expect(screen.getByText(storageLocation)).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(container.querySelector('.gcs-toggle .material-icons').textContent.trim()).toBe(
      'expand_more'
    );
  });

  test('the caret is decorative, so it stays out of the accessible name', () => {
    renderButtons('internal');
    const toggle = screen.getByRole('button', { name: 'GCP Storage' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('external users get no GCS control at all', () => {
    const { container } = renderButtons('external');
    expect(screen.queryByRole('button', { name: /gcp storage/i })).not.toBeInTheDocument();
    expect(container.querySelector('.gcs-toggle')).toBeNull();
  });
});
