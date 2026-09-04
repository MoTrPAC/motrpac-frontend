import { describe, test, expect } from 'vitest';
import React from 'react';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import BundleDatasetCard from '../bundleDatasetCard';
import { visibleBundleCards } from '../../../lib/bundleDataCards';
import BundleDataTypes from '../bundleDataTypes';

const cardFor = (code, userType) =>
  visibleBundleCards(userType).find((card) => card.code === code);

describe('visibleBundleCards - access', () => {
  test('internal users get all four groups', () => {
    expect(visibleBundleCards('internal').map((c) => c.code)).toEqual([
      'rat-training-06',
      'rat-acute-06',
      'human-precovid-sed-adu',
      'human-clinical',
    ]);
  });

  test('the internal-only groups are absent for everyone else', () => {
    ['external', undefined].forEach((userType) => {
      const codes = visibleBundleCards(userType).map((c) => c.code);
      expect(codes).not.toContain('rat-acute-06');
      expect(codes).not.toContain('human-clinical');
    });
  });

  test('the human acute group serves a different list per audience', () => {
    // Same gating the tab strip had: internal sees more bundles than external.
    const internal = cardFor('human-precovid-sed-adu', 'internal').datasets;
    const external = cardFor('human-precovid-sed-adu', 'external').datasets;
    expect(internal).toHaveLength(BundleDataTypes.human_sed_adu_internal.length);
    expect(external).toHaveLength(BundleDataTypes.human_sed_adu_external.length);
    expect(external.length).toBeLessThan(internal.length);
  });
});

describe('BundleDatasetCard - rendering', () => {
  const card = cardFor('rat-training-06', 'internal');

  test('renders one cell per bundle, none dropped', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelectorAll('.bundle-dataset-cell')).toHaveLength(
      BundleDataTypes.pass1b_06.length
    );
  });

  test('wears the collection-card frame and its study badges', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelector('.study-collection-card')).toBeInTheDocument();
    expect(screen.getByText(card.name)).toBeInTheDocument();
    expect(screen.getByText('rat-training-06')).toBeInTheDocument();
    expect(screen.getByText('Endurance training')).toBeInTheDocument();
  });

  test('a bundle with a second reference-genome build offers both downloads', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const epigenomics = [...container.querySelectorAll('.bundle-dataset-cell')].find((cell) =>
      within(cell).queryByText('Epigenomics')
    );
    // Neither build supersedes the other; a user may need a specific assembly.
    expect(epigenomics.textContent).toContain('RN6');
    expect(epigenomics.textContent).toContain('RN7');
  });

  test('counts its bundles in the header', () => {
    renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(screen.getByText(new RegExp(`${card.datasets.length} bundles`))).toBeInTheDocument();
  });
});

describe('BundleDatasetCard - badges only where they distinguish', () => {
  test('a cohort every bundle shares is not repeated on each row', () => {
    // The card title already says "Young Adult Rats"; badging all 17 rows with
    // "Young Adult" adds nothing.
    const card = cardFor('rat-training-06', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelectorAll('.participant-badge')).toHaveLength(0);
  });

  test('the human acute card drops its shared Adult and Pre-Suspension badges', () => {
    const card = cardFor('human-precovid-sed-adu', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelectorAll('.participant-badge')).toHaveLength(0);
  });

  test('a card whose bundles genuinely differ keeps the badges', () => {
    // Clinical Data spans Adult and Pediatric, so the badge carries information.
    const card = cardFor('human-clinical', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelectorAll('.participant-badge').length).toBeGreaterThan(0);
    expect(screen.getByText('Pediatric')).toBeInTheDocument();
  });
});

describe('BundleDatasetCard - layout', () => {
  test('bundles lay out two per row', () => {
    const card = cardFor('rat-training-06', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const row = container.querySelector('.bundle-dataset-row');
    expect(row.className).toContain('row-cols-lg-2');
    expect(container.querySelectorAll('.bundle-dataset-cell')).toHaveLength(card.datasets.length);
  });

  test('download buttons are small and neutral, so they do not outshout the titles', () => {
    const card = cardFor('human-clinical', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const buttons = container.querySelectorAll('.btn-bundle-data-download');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      expect(button.className).toContain('btn-sm');
      expect(button.className).toContain('btn-secondary');
      expect(button.className).not.toContain('btn-primary');
      expect(button.className).not.toContain('btn-block');
    });
  });
});

describe('BundleDatasetCard - buttons sit below the description', () => {
  const card = cardFor('rat-training-06', 'internal');

  test('the actions come after the description within each cell', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const cell = container.querySelector('.bundle-dataset-cell');
    const children = [...cell.children].map((child) => child.className);
    expect(children[0]).toContain('bundle-dataset-info');
    expect(children[children.length - 1]).toContain('bundle-dataset-actions');
  });

  test('they are centred, not pushed to one side', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    container.querySelectorAll('.bundle-dataset-actions').forEach((actions) => {
      expect(actions.className).toContain('justify-content-center');
    });
    container
      .querySelectorAll('.open-access-bundle-data-download-container')
      .forEach((wrapper) => {
        expect(wrapper.className).toContain('justify-content-center');
      });
  });

  test('a paired build still offers both, side by side', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const paired = [...container.querySelectorAll('.bundle-dataset-actions')].find(
      (actions) => actions.children.length === 2
    );
    expect(paired).toBeTruthy();
    [...paired.children].forEach((child) => {
      expect(child.className).toContain('open-access-bundle-data-download-container');
    });
  });
});


describe('BundleDatasetCard - button contents', () => {
  test('the button holds no icon; the row is anchored by the title tile instead', () => {
    const card = cardFor('rat-training-06', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const buttons = [...container.querySelectorAll('.btn-bundle-data-download')];
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      expect(button.querySelector('.material-icons')).toBeNull();
    });
    // One download affordance per row, not two.
    expect(container.querySelectorAll('.bundle-dataset-icon .material-icons').length).toBe(
      card.datasets.length
    );
  });

  test('the size label still shows', () => {
    const card = cardFor('rat-training-06', 'internal');
    renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(screen.getByText(/617\.78 KB/)).toBeInTheDocument();
  });
});

describe('BundleDatasetCard - the title has its own anchor', () => {
  test('each bundle title is paired with a tile, so the button is not the only focal point', () => {
    const card = cardFor('rat-training-06', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);

    const headings = [...container.querySelectorAll('.bundle-dataset-heading')];
    expect(headings).toHaveLength(card.datasets.length);
    headings.forEach((heading) => {
      const tile = heading.querySelector('.bundle-dataset-icon');
      expect(tile).toBeInTheDocument();
      expect(tile.textContent.trim()).toBe('cloud_download');
      expect(heading.querySelector('.bundle-dataset-title')).toBeInTheDocument();
    });
  });

  test('the tile is decorative and stays out of the accessible name', () => {
    const card = cardFor('rat-training-06', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    container.querySelectorAll('.bundle-dataset-icon').forEach((tile) => {
      expect(tile).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('the title still reads as the data type', () => {
    const card = cardFor('rat-training-06', 'internal');
    renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    card.datasets.forEach((dataset) => {
      expect(screen.getAllByText(dataset.title).length).toBeGreaterThan(0);
    });
  });
});
