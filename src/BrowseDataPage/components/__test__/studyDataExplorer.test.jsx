import { describe, test, expect } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import StudyDataExplorer from '../studyDataExplorer';
import { visibleBundleCards } from '../../../lib/bundleDataCards';

function renderExplorer(userType) {
  return renderWithProviders(
    <StudyDataExplorer userType={userType} />
  );
}

describe('StudyDataExplorer - view toggle', () => {
  test('shows the Study Collections panel by default, and switches to Data Releases on click', async () => {
    renderExplorer('internal');

    // Stage sections belong to the Data Releases view only.
    expect(screen.queryByRole('heading', { name: /^public release$/i })).not.toBeInTheDocument();
    expect(screen.getByText('Progressive treadmill training for 1, 2, 4 or 8 weeks in young adult rats, with 18 tissues coillected 48-hour after the last bout.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    expect(
      await screen.findByRole('heading', { name: /^public release$/i })
    ).toBeInTheDocument();
  });
});

describe('StudyDataExplorer - access control on card visibility', () => {
  // rat-acute-06 was the consortium-only example until c2.0/c4.0 were released
  // publicly on 2026-09-08. The human main study holds that shape now.
  test('external users never see a study with zero public collections', () => {
    renderExplorer('external');
    expect(screen.queryByText('Human Main Study')).not.toBeInTheDocument();
  });

  test('internal users see it', () => {
    renderExplorer('internal');
    expect(screen.getByText('Human Main Study')).toBeInTheDocument();
  });

  test('rat-acute-06 is visible to external users now that c2.0 and c4.0 are public', () => {
    renderExplorer('external');
    expect(screen.getByText('Acute Exercise in Young Adult Rats')).toBeInTheDocument();
  });
});

// SKIPPED: the species/design/stage filter bar is currently commented out in
// studyDataExplorer.jsx pending a restyle scoped to the Study Collections view.
// Re-enable this test when that block comes back.
describe.skip('StudyDataExplorer - species filter', () => {
  test('selecting Human hides rat studies', () => {
    renderExplorer('internal');
    const filters = screen.getByRole('group', { name: /species/i });

    fireEvent.click(within(filters).getByRole('button', { name: /^human$/i }));

    expect(screen.queryByText('Endurance Training in Young Adult Rats')).not.toBeInTheDocument();
    expect(screen.getByText('Acute Exercise in Human Sedentary Adults')).toBeInTheDocument();
  });
});

describe('StudyDataExplorer - Data Releases panel', () => {
  test('external users see a Public section but no Consortium section at all', async () => {
    renderExplorer('external');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    expect(
      await screen.findByRole('heading', { name: /^public release$/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^consortium release$/i })).not.toBeInTheDocument();
    // rat-training-06 c2.0 quantID/analysis and human-precovid phenotype c2.0 are public
    expect(screen.getAllByText('c2.0').length).toBeGreaterThan(0);
    // rat-training-06 c3.0 quantID is consortium-only - must never appear for external users
    expect(screen.queryByText('c3.0')).not.toBeInTheDocument();
  });

  test('internal users see both Public and Consortium sections', async () => {
    renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    expect(
      await screen.findByRole('heading', { name: /^public release$/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^consortium release$/i })).toBeInTheDocument();
    expect(screen.getAllByText('c3.0').length).toBeGreaterThan(0);
  });
});

describe('StudyDataExplorer - Browse Files scopes the file browser to one collection', () => {
  test('clicking Browse Files loads only that collection, not the whole study', async () => {
    const { store } = renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));
    await screen.findByRole('heading', { name: /^public release$/i });

    // First row of the Public section is rat-training-06.
    fireEvent.click(screen.getAllByRole('button', { name: /browse files/i })[0]);

    await waitFor(() => {
      expect(store.getState().browseData.loadingFiles).toBe(false);
    });

    const state = store.getState().browseData;
    expect(state.selectedCollections).toHaveLength(1);

    const [prefix] = state.selectedCollections;
    expect(prefix).toMatch(/^(quant-id|analysis|phenotype)\/rat-training-06\/c\d+\.\d+$/);
    expect(state.allFiles.length).toBeGreaterThan(0);

    // Every loaded file belongs to the clicked collection - this is the whole point.
    const strays = state.allFiles.filter((file) => !file.object.startsWith(`${prefix}/`));
    expect(strays).toEqual([]);

    // No per-study flags any more: the loaded set is the record of what is in
    // scope, and it can span studies.
    expect(state.loadedCollections).toEqual([prefix]);
  });

  test('the collection a user is not entitled to is never offered', async () => {
    renderExplorer('external');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));
    await screen.findByRole('heading', { name: /^public release$/i });
    expect(screen.queryByText('c3.0')).not.toBeInTheDocument();
  });
});

describe('StudyDataExplorer - supporting human collections', () => {
  test('internal users see the cross-study phenotype section', () => {
    renderExplorer('internal');
    expect(
      screen.getByRole('heading', { name: /supporting human collections/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/human extended quality control/i)).toBeInTheDocument();
  });

  test('external users do not - human-eqc is consortium-only', () => {
    renderExplorer('external');
    expect(
      screen.queryByRole('heading', { name: /supporting human collections/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/human extended quality control/i)).not.toBeInTheDocument();
  });
});

describe('StudyDataExplorer - the panel crossfades between views', () => {
  test('fades out, swaps while invisible, then fades back in', async () => {
    const { container } = renderExplorer('internal');
    const panel = () => container.querySelector('.study-data-explorer-panel');

    expect(panel().className).not.toMatch(/is-fading/);
    expect(container.querySelector('.study-collections-panel')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    // Still showing the old view, now transparent - the swap happens while the
    // panel is invisible, so the user never sees content jump.
    expect(panel().className).toMatch(/is-fading/);
    expect(container.querySelector('.study-collections-panel')).toBeInTheDocument();

    await screen.findByRole('heading', { name: /^public release$/i });

    expect(panel().className).not.toMatch(/is-fading/);
    expect(container.querySelector('.study-collections-panel')).not.toBeInTheDocument();
  });

  test('clicking the already-active tab does not start a fade', () => {
    const { container } = renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /study collections/i }));
    expect(container.querySelector('.study-data-explorer-panel').className).not.toMatch(
      /is-fading/
    );
  });
});

describe('StudyDataExplorer - Bundle Datasets tab', () => {
  test('is the third tab, after Study Collections and Data Releases', () => {
    const { container } = renderExplorer('internal');
    const labels = [...container.querySelectorAll('.study-data-explorer-tabs button')].map(
      (b) => b.textContent
    );
    expect(labels).toEqual(['Study Collections', 'Data Releases', 'Bundle Datasets']);
  });

  test('shows a card per bundle group, in the collection-card style', async () => {
    const { container } = renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /bundle datasets/i }));

    // Bundle cards share their names with the study collection cards, so waiting
    // on a name would resolve against the panel we are leaving. Wait for the
    // bundles panel itself.
    const cards = visibleBundleCards('internal');
    await waitFor(() =>
      expect(container.querySelectorAll('.bundle-dataset-card').length).toBe(cards.length)
    );
    cards.forEach((card) => expect(screen.getByText(card.name)).toBeInTheDocument());
    expect(container.querySelectorAll('.bundle-dataset-card')).toHaveLength(cards.length);
  });

  test('external users get only the groups they may see', async () => {
    const { container } = renderExplorer('external');
    fireEvent.click(screen.getByRole('tab', { name: /bundle datasets/i }));

    const external = visibleBundleCards('external');
    await waitFor(() =>
      expect(container.querySelectorAll('.bundle-dataset-card').length).toBe(external.length)
    );
    // The internal-only groups must be absent, not merely empty.
    const internalOnly = visibleBundleCards('internal')
      .map((card) => card.name)
      .filter((name) => !external.some((card) => card.name === name));
    expect(internalOnly.length).toBeGreaterThan(0);
    internalOnly.forEach((name) => expect(screen.queryByText(name)).not.toBeInTheDocument());
    expect(container.querySelectorAll('.bundle-dataset-card')).toHaveLength(external.length);
  });

  test('switching away unmounts the bundle cards', async () => {
    const { container } = renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /bundle datasets/i }));
    await waitFor(() =>
      expect(container.querySelectorAll('.bundle-dataset-card').length).toBeGreaterThan(0)
    );

    fireEvent.click(screen.getByRole('tab', { name: /study collections/i }));
    await screen.findByRole('heading', { name: /supporting human collections/i });
    expect(container.querySelectorAll('.bundle-dataset-card')).toHaveLength(0);
  });
});
