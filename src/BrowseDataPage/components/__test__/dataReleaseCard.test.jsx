import { describe, test, expect, vi } from 'vitest';
import { screen, fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import DataReleaseCards from '../dataReleaseCard';
import studyDataCards from '../../../lib/studyDataCards';
import { hasVisibleCollections } from '../../../lib/studyDataAccess';

// Mirrors what StudyDataExplorer passes in: studies already access-filtered.
function visibleStudiesFor(userType) {
  return studyDataCards.filter((study) => hasVisibleCollections(study, userType));
}

function renderReleases(userType, onBrowseFiles = () => {}) {
  return render(
    <DataReleaseCards
      studies={visibleStudiesFor(userType)}
      userType={userType}
      onBrowseFiles={onBrowseFiles}
    />
  );
}

const bucketName = import.meta.env.VITE_DATA_FILE_BUCKET;

describe('DataReleaseCards - stage sections', () => {
  test('external users get a Public section only; the Consortium section is absent, not empty', () => {
    renderReleases('external');

    expect(screen.getByRole('heading', { name: /^public release$/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^consortium release$/i })).not.toBeInTheDocument();
  });

  test('internal users get both stage sections', () => {
    renderReleases('internal');

    expect(screen.getByRole('heading', { name: /^public release$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^consortium release$/i })).toBeInTheDocument();
  });

  test('each section counts only the collections it contains', () => {
    renderReleases('internal');

    // Public: rat-training-06 (quantID c2.0/c1.0, analysis c2.0/c1.0, phenotype c4.0) = 5,
    // plus human-precovid-sed-adu analysis c1.3 = 1. Its Quant-ID and Phenotype are
    // consortium-only pending dbGaP-gated access.
    const publicSection = screen.getByRole('region', { name: /^public release$/i });
    expect(within(publicSection).getByText('6 collections')).toBeInTheDocument();

    // Consortium: rat-training-06 quantID c3.0 = 1, rat-acute-06 (quantID c2.0/c1.0,
    // analysis c2.0/c1.1/c1.0, phenotype c4.0) = 6, human-precovid (quantID c1.0,
    // phenotype c3.0/c2.0) = 3.
    const consortiumSection = screen.getByRole('region', { name: /^consortium release$/i });
    expect(within(consortiumSection).getByText('10 collections')).toBeInTheDocument();
  });
});

describe('DataReleaseCards - consortium data never leaks to external users', () => {
  test('no consortium storage path or GCP Storage control is rendered anywhere for external users', () => {
    const { container } = renderReleases('external');

    // c3.0 of rat-training-06 quant-id is consortium-only.
    expect(container.textContent).not.toContain(
      `gs://${bucketName}/quant-id/rat-training-06/c3.0`
    );
    expect(container.textContent).not.toContain('c3.0');
    expect(screen.queryByRole('button', { name: /gcp storage/i })).not.toBeInTheDocument();
  });

  test('rat-acute-06 is absent entirely for external users - all of its collections are consortium', () => {
    renderReleases('external');

    expect(screen.queryByText('Acute Exercise in Young Adult Rats')).not.toBeInTheDocument();
  });

  test('human-precovid-sed-adu exposes only its Analysis collection publicly - Quant-ID and Phenotype are dbGaP-gated', () => {
    const { container } = renderReleases('external');

    // The study is visible (its Analysis c1.3 is public)...
    expect(screen.getByText('Acute Exercise in Human Sedentary Adults')).toBeInTheDocument();
    // ...but neither gated collection's storage path may appear.
    expect(container.textContent).not.toContain('quant-id/human-precovid');
    expect(container.textContent).not.toContain('phenotype/human-precovid-sed-adu');
  });
});

describe('DataReleaseCards - collection grouping by stage', () => {
  test('a study appears under both stages when it has collections at each', () => {
    renderReleases('internal');

    // rat-training-06 has public (c2.0/c1.0) and consortium (c3.0) quant-id collections,
    // so its name appears in both the Public and Consortium sections.
    expect(screen.getAllByText('Endurance Training in Young Adult Rats')).toHaveLength(2);
  });

  test('the newest collection at a stage is labelled Latest for that stage', () => {
    renderReleases('external');

    expect(screen.getAllByText(/Latest PR/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Latest CR/)).not.toBeInTheDocument();
  });

  test('earlier collections at the same stage are collapsed behind a toggle', () => {
    renderReleases('external');

    // rat-training-06 public quant-id has c2.0 (latest) and c1.0 (earlier). c1.0 is also
    // human-precovid's latest public quant-id, so count the change rather than presence.
    const beforeExpanding = screen.queryAllByText('c1.0').length;

    fireEvent.click(screen.getAllByRole('button', { name: /other collections/i })[0]);

    expect(screen.getByText(/Earlier PR collections/i)).toBeInTheDocument();
    expect(screen.queryAllByText('c1.0').length).toBeGreaterThan(beforeExpanding);
  });
});

describe('DataReleaseCards - collection family chips', () => {
  test('each collection family renders its lettered chip alongside its name', () => {
    const { container } = renderReleases('external');

    expect(screen.getAllByText('Quant-ID').length).toBeGreaterThan(0);
    expect(container.querySelector('.kind-chip-quantID .kind-chip-letter').textContent).toBe('Q');
    expect(container.querySelector('.kind-chip-analysis .kind-chip-letter').textContent).toBe('A');
    expect(container.querySelector('.kind-chip-phenotype .kind-chip-letter').textContent).toBe('P');
  });
});

describe('DataReleaseCards - Browse Files', () => {
  test('clicking Browse Files passes back the clicked collection, not its study', () => {
    const onBrowseFiles = vi.fn();
    renderReleases('external', onBrowseFiles);

    fireEvent.click(screen.getAllByRole('button', { name: /browse files/i })[0]);

    expect(onBrowseFiles).toHaveBeenCalledTimes(1);
    // The storage location identifies one collection; the study alone could not
    // tell the file browser which of its collections to load.
    expect(onBrowseFiles.mock.calls[0][0]).toMatch(
      /^gs:\/\/[^/]+\/(quant-id|analysis|phenotype)\/rat-training-06\/c\d+\.\d+$/
    );
  });
});
