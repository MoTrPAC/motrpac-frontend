import { describe, test, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { render } from '@testing-library/react';
import StudyCollectionCard from '../studyCollectionCard';
import studyDataCards from '../../../lib/studyDataCards';

const ratTraining06 = studyDataCards.find((s) => s.code === 'rat-training-06');

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
      screen.getByText('gs://motrpac-data-hub/quant-id/rat-training-06/c3.0')
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

    expect(screen.getByText(/no phenotype collections available/i)).toBeInTheDocument();
  });

  test('an empty cell still renders its family chip, and does not crash when userType changes it from empty to populated', () => {
    const { rerender } = render(
      <StudyCollectionCard study={ratTraining06} userType="external" />
    );

    // rat-acute-06 has no public collections at all, so every cell starts empty and
    // then populates for an internal user - this used to break the Rules of Hooks.
    const ratAcute06 = studyDataCards.find((s) => s.code === 'rat-acute-06');
    rerender(<StudyCollectionCard study={ratAcute06} userType="external" />);
    expect(screen.getAllByText(/no .* collections available/i)).toHaveLength(3);

    rerender(<StudyCollectionCard study={ratAcute06} userType="internal" />);
    expect(screen.queryByText(/collections available/i)).not.toBeInTheDocument();
  });
});
