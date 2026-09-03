import { describe, test, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { render } from '@testing-library/react';
import StudyCollectionCard from '../studyCollectionCard';
import studyDataCards from '../../../lib/studyDataCards';

const ratTraining06 = studyDataCards.find((s) => s.code === 'rat-training-06');

const bucketName = import.meta.env.VITE_DATA_FILE_BUCKET;

describe('StudyCollectionCard - genome badge access control', () => {
  test('external users see the Rn7 badge (latest public quantID) but never Rn8 (consortium-only c3.0)', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="external" />);

    expect(screen.getAllByText('Rn7').length).toBeGreaterThan(0);
    expect(screen.queryByText('Rn8')).not.toBeInTheDocument();
  });

  test('internal users see the Rn8 badge (latest overall, consortium-only)', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="internal" />);

    expect(screen.getByText('Rn8')).toBeInTheDocument();
  });
});

describe('StudyCollectionCard - GCS-path reveal', () => {
  test('shows a GCP bucket toggle for internal users, absent for external users', () => {
    const { rerender } = render(
      <StudyCollectionCard study={ratTraining06} userType="internal" />
    );
    expect(screen.getAllByRole('button', { name: /gcp storage/i }).length).toBeGreaterThan(0);

    rerender(<StudyCollectionCard study={ratTraining06} userType="external" />);
    expect(screen.queryByRole('button', { name: /gcp storage/i })).not.toBeInTheDocument();
  });

  test('reveals the real storageLocation path directly, and never renders an Open-in-console link', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="internal" />);

    fireEvent.click(screen.getAllByRole('button', { name: /gcp storage/i })[0]);

    expect(
      screen.getByText(`gs://${bucketName}/quant-id/rat-training-06/c3.0`)
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /open/i })).not.toBeInTheDocument();
  });
});

describe('StudyCollectionCard - header content', () => {
  test('shows study name, code, cohort, species, design and description', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="external" />);

    expect(screen.getByText('Endurance Training in Young Adult Rats')).toBeInTheDocument();
    expect(screen.getByText('rat-training-06')).toBeInTheDocument();
    expect(screen.getByText(/6 month old/)).toBeInTheDocument();
    expect(screen.getByText('rat')).toBeInTheDocument();
    expect(screen.getByText('Endurance training')).toBeInTheDocument();
    expect(
      screen.getByText(/Progressive treadmill training for 1, 2, 4 or 8 weeks/)
    ).toBeInTheDocument();
  });
});

describe('StudyCollectionCard - release stage badges', () => {
  test('external users see the public stage code on the latest visible collection, never the consortium one', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="external" />);

    expect(screen.getAllByText('PR').length).toBeGreaterThan(0);
    expect(screen.queryByText('CR')).not.toBeInTheDocument();
  });

  test('internal users see the consortium stage code on rat-training-06 Quant-ID (c3.0)', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="internal" />);

    expect(screen.getAllByText('CR').length).toBeGreaterThan(0);
  });
});

describe('StudyCollectionCard - Browse Files action', () => {
  test('clicking Browse Files calls the onBrowseFiles callback', () => {
    const onBrowseFiles = vi.fn();
    render(
      <StudyCollectionCard
        study={ratTraining06}
        userType="external"
        onBrowseFiles={onBrowseFiles}
      />
    );

    fireEvent.click(screen.getAllByRole('button', { name: /browse files/i })[0]);

    expect(onBrowseFiles).toHaveBeenCalledTimes(1);
  });
});

describe('StudyCollectionCard - empty kind-cell state', () => {
  test('shows an empty-state message for a kind with no visible versions, instead of crashing', () => {
    const studyWithNoPublicPhenotype = {
      ...ratTraining06,
      dataTypes: { ...ratTraining06.dataTypes, phenotype: [] },
    };

    render(<StudyCollectionCard study={studyWithNoPublicPhenotype} userType="external" />);

    expect(screen.getByText(/phenotype results are in preparation/i)).toBeInTheDocument();
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
  });

  test('an empty cell still renders its family chip, and does not crash when userType changes it from empty to populated', () => {
    const { rerender } = render(
      <StudyCollectionCard study={ratTraining06} userType="external" />
    );

    // rat-acute-06 has no public collections at all, so every cell starts empty and
    // then populates for an internal user - this used to break the Rules of Hooks.
    // Its collections exist, so the cells read "Restricted", not "in preparation".
    const ratAcute06 = studyDataCards.find((s) => s.code === 'rat-acute-06');
    rerender(<StudyCollectionCard study={ratAcute06} userType="external" />);
    expect(screen.getAllByText(/not available for direct download/i)).toHaveLength(3);
    expect(screen.queryByText(/results are in preparation/i)).not.toBeInTheDocument();

    rerender(<StudyCollectionCard study={ratAcute06} userType="internal" />);
    expect(screen.queryByText(/not available for direct download/i)).not.toBeInTheDocument();
  });
});

describe('StudyCollectionCard - collections whose metadata is not generated yet', () => {
  test('Browse Files is disabled rather than navigating nowhere', () => {
    // human-main's phenotype sub-collections are declared but have no metadata
    // file yet, so browsing them would resolve to an empty scope and bounce the
    // user back to the download page.
    const humanMain = studyDataCards.find((s) => s.code === 'human-main');
    const { container } = render(<StudyCollectionCard study={humanMain} userType="internal" />);

    const browse = [...container.querySelectorAll('.study-collection-kind-cell')]
      .flatMap((cell) => [...cell.querySelectorAll('button')])
      .filter((button) => button.textContent.match(/browse files/i));
    expect(browse.length).toBeGreaterThan(0);
    browse.forEach((button) => expect(button).toBeDisabled());
  });

  test('a collection with metadata stays enabled', () => {
    render(<StudyCollectionCard study={ratTraining06} userType="internal" />);
    const browse = screen.getAllByRole('button', { name: /browse files/i });
    expect(browse.some((button) => !button.disabled)).toBe(true);
  });
});

describe('StudyCollectionCard - a kind with several series', () => {
  const humanMain = studyDataCards.find((s) => s.code === 'human-main');

  test('each sub-collection is named and keeps its own versions', () => {
    render(<StudyCollectionCard study={humanMain} userType="internal" />);

    // Derived from config: the sub-collections get renamed and added to, and a
    // hardcoded list here only breaks when that happens.
    humanMain.dataTypes.phenotype.forEach((series) => {
      expect(screen.getByText(series.name)).toBeInTheDocument();
    });
  });

  test('phenotype no longer claims to be pending', () => {
    // It has released collections, they are just held in named sub-collections.
    render(<StudyCollectionCard study={humanMain} userType="internal" />);
    expect(screen.queryByText(/phenotype results are in preparation/i)).not.toBeInTheDocument();
  });

  test('analysis is still pending, because it genuinely has nothing released', () => {
    render(<StudyCollectionCard study={humanMain} userType="internal" />);
    expect(screen.getByText(/analysis results are in preparation/i)).toBeInTheDocument();
  });

  test('external users see none of it - nothing here is public', () => {
    const { container } = render(<StudyCollectionCard study={humanMain} userType="external" />);
    expect(container.textContent).not.toContain('Sedentary Adults');
    expect(container.textContent).not.toContain('Pediatrics');
  });
});

describe('StudyCollectionCard - series identity', () => {
  test('each sub-collection shows its code between the title and the description', () => {
    const humanMain = studyDataCards.find((s) => s.code === 'human-main');
    const { container } = render(<StudyCollectionCard study={humanMain} userType="internal" />);

    humanMain.dataTypes.phenotype.map((series) => series.code).forEach((code) => {
      const el = screen.getByText(code);
      expect(el.tagName).toBe('CODE');

      // Ordering matters: title, then code, then description.
      const head = el.closest('.collection-series-head');
      const order = [...head.children].map((child) => child.className);
      expect(order).toEqual([
        expect.stringContaining('collection-series-name'),
        expect.stringContaining('collection-series-code'),
        expect.stringContaining('collection-series-desc'),
      ]);
    });

    expect(container.querySelectorAll('.collection-series-code')).toHaveLength(
      humanMain.dataTypes.phenotype.length
    );
  });

  test('a single-series kind renders no code line', () => {
    // rat-training-06's phenotype is one unnamed series, so there is no
    // sub-collection identity to show.
    const { container } = render(<StudyCollectionCard study={ratTraining06} userType="internal" />);
    expect(container.querySelector('.collection-series-code')).toBeNull();
  });
});

describe('StudyCollectionCard - released but not served by the Data Hub', () => {
  const humanPrecovid = studyDataCards.find((s) => s.code === 'human-precovid-sed-adu');

  test('a dbGaP-gated kind says so, instead of claiming the data is unfinished', () => {
    render(<StudyCollectionCard study={humanPrecovid} userType="external" />);

    // Quant-ID and Phenotype are publicly released but obtained through dbGaP.
    expect(screen.getAllByText(/applying through dbGaP/i)).toHaveLength(2);
    expect(screen.queryByText(/results are in preparation/i)).not.toBeInTheDocument();
    expect(screen.getAllByText('Restricted')).toHaveLength(2);
  });

  test('its public Analysis collection is still browsable', () => {
    render(<StudyCollectionCard study={humanPrecovid} userType="external" />);
    expect(screen.getByText('c1.3')).toBeInTheDocument();
  });

  test('internal users get the collections themselves, not the notice', () => {
    render(<StudyCollectionCard study={humanPrecovid} userType="internal" />);
    expect(screen.queryByText(/applying through dbGaP/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Restricted')).not.toBeInTheDocument();
    expect(screen.getByText('c1.0')).toBeInTheDocument();
  });

  test('a kind with nothing declared still reads as pending, not restricted', () => {
    // human-main's analysis is an empty array: it applies, but has nothing yet.
    const humanMain = studyDataCards.find((s) => s.code === 'human-main');
    render(<StudyCollectionCard study={humanMain} userType="internal" />);
    expect(screen.getByText(/analysis results are in preparation/i)).toBeInTheDocument();
    expect(screen.queryByText('Restricted')).not.toBeInTheDocument();
  });
});
