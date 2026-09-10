import { describe, test, expect } from 'vitest';
import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
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
    // rat-acute-06 used to be here too; its c2.0 and c4.0 bundles were released
    // publicly on 2026-09-08, so it is visible now. The property is the gating,
    // not which studies happen to be consortium-only this week.
    ['external', undefined].forEach((userType) => {
      const codes = visibleBundleCards(userType).map((c) => c.code);
      expect(codes).not.toContain('human-clinical');
    });
  });

  test('gating is per collection, so a consortium-only group vanishes for external users', () => {
    // Derived rather than hardcoded: whichever groups are consortium throughout
    // must be absent entirely for external users, rather than appearing empty.
    const CODE_FOR = {
      rat_training_06: 'rat-training-06',
      rat_acute_06: 'rat-acute-06',
      human_precovid_sed_adu: 'human-precovid-sed-adu',
      human_phenotype: 'human-clinical',
    };
    const consortiumOnly = Object.entries(CODE_FOR).filter(([key]) =>
      BundleDataTypes[key].every((bundle) =>
        bundle.collections.every((c) => c.releaseStage !== 'public')
      )
    );
    expect(consortiumOnly.length).toBeGreaterThan(0);

    const codes = visibleBundleCards('external').map((card) => card.code);
    consortiumOnly.forEach(([, code]) => expect(codes).not.toContain(code));
  });

  test('a group with any public collection stays visible to external users', () => {
    // The other half of the same rule: rat-acute-06 is mixed since 2026-09-08,
    // and a mixed group must appear, carrying only its public bundles.
    const mixed = BundleDataTypes.rat_acute_06.some((bundle) =>
      bundle.collections.some((c) => c.releaseStage === 'public')
    );
    expect(mixed).toBe(true);
    expect(visibleBundleCards('external').map((c) => c.code)).toContain('rat-acute-06');
  });

  test('every bundle an external user sees has only public collections', () => {
    visibleBundleCards('external').forEach((card) => {
      card.datasets.forEach((bundle) => {
        expect(bundle.collections.length).toBeGreaterThan(0);
        bundle.collections.forEach((c) => expect(c.releaseStage).toBe('public'));
      });
    });
  });
});

describe('BundleDatasetCard - rendering', () => {
  const card = cardFor('rat-training-06', 'internal');

  test('renders one cell per bundle, none dropped', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelectorAll('.bundle-dataset-cell')).toHaveLength(
      card.datasets.length
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
    // `getAllByText`, not `getByText`: two of its bundles are pediatric since
    // the human-main cohorts were added, and the point is that the badge is
    // present, not that it is unique.
    const card = cardFor('human-clinical', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const badges = [...container.querySelectorAll('.participant-badge')].map(
      (badge) => badge.textContent
    );
    expect(badges).toContain('Pediatric');
    expect(badges).toContain('Adult');
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

  test('a bundle leads with its latest collection only', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    // One button per bundle up front, however many collections it has.
    expect(container.querySelectorAll('.bundle-dataset-actions .bundle-collection')).toHaveLength(
      card.datasets.length
    );
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
      // The tile says what the row is; the button says what happens to it.
      // `folder` is in the classic Material Icons set the app loads -- a newer
      // glyph would render as its own literal name.
      expect(tile.textContent.trim()).toBe('folder');
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

describe('BundleDatasetCard - cohort line', () => {
  test('the card header names its cohort, as the study collection cards do', () => {
    const card = cardFor('human-precovid-sed-adu', 'internal');
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const header = container.querySelector('.study-collection-code');
    expect(header.textContent).toContain(card.code);
    expect(header.textContent).toContain('Pre-Suspension');
    expect(header.textContent).toContain('bundles');
  });

  test('a card with no single cohort omits the line rather than inventing one', () => {
    // Clinical Data spans adults and pediatrics; its per-bundle badges say so.
    const card = cardFor('human-clinical', 'internal');
    expect(card.cohort).toBeUndefined();
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    expect(container.querySelector('.study-collection-code').textContent).toContain(card.code);
  });
});

describe('BundleDatasetCard - card notices', () => {
  const withNotice = () => visibleBundleCards('internal').filter((card) => card.notice);

  test('at least one card carries a notice', () => {
    expect(withNotice().length).toBeGreaterThan(0);
  });

  test('a notice renders below the bundles, with its own icon and link', () => {
    withNotice().forEach((card) => {
      const { container, unmount } = renderWithProviders(
        <BundleDatasetCard card={card} profile={{}} />
      );

      const notice = container.querySelector('.bundle-dataset-notice');
      expect(notice).toBeInTheDocument();
      // Last thing in the card, after the grid.
      const children = [...container.querySelector('.bundle-dataset-card').children];
      expect(children[children.length - 1]).toBe(notice);

      expect(notice.querySelector('.bundle-dataset-notice-icon').className).toContain(
        card.notice.icon
      );
      expect(notice.textContent).toContain(card.notice.linkText);
      unmount();
    });
  });

  test('every notice routes through ExternalLink, so target and rel cannot drift', () => {
    withNotice().forEach((card) => {
      const { container, unmount } = renderWithProviders(
        <BundleDatasetCard card={card} profile={{}} />
      );
      const link = container.querySelector('.bundle-dataset-notice a');
      expect(link).toHaveAttribute('href', card.notice.href);
      expect(link.className).toContain('inline-link-with-icon');
      expect(link).toHaveAttribute('target', '_blank');
      // Without noopener the opened page gets a handle back to this one.
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      unmount();
    });
  });

  test('uses the stock primary callout treatment', () => {
    const card = withNotice()[0];
    const { container } = renderWithProviders(<BundleDatasetCard card={card} profile={{}} />);
    const notice = container.querySelector('.bundle-dataset-notice');
    expect(notice.className).toContain('bd-callout-primary');
    expect(notice.querySelector('.text-primary')).toBeInTheDocument();
  });

  test('cards without a notice render none', () => {
    visibleBundleCards('internal')
      .filter((card) => !card.notice)
      .forEach((card) => {
        const { container, unmount } = renderWithProviders(
          <BundleDatasetCard card={card} profile={{}} />
        );
        expect(container.querySelector('.bundle-dataset-notice')).toBeNull();
        unmount();
      });
  });
});

describe('BundleDatasetCard - collection versions', () => {
  const card = () => cardFor('rat-training-06', 'internal');
  const multi = () => card().datasets.find((bundle) => bundle.collections.length > 1);

  test('the button names the collection rather than a file size', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    const buttons = [...container.querySelectorAll('.btn-bundle-data-download')];
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      // A verb, so the control reads as an action rather than naming a thing.
      expect(button.textContent).toMatch(/^Get Collection c\d+\.\d+$/);
    });
  });

  test('no size is rendered under the buttons; it belongs in the description', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    expect(container.querySelector('.bundle-collection-size')).toBeNull();
  });

  test('older collections are hidden until asked for', () => {
    const bundle = multi();
    expect(bundle).toBeTruthy();
    const older = bundle.collections.find((c) => !c.latest);

    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    // Scoped to this bundle's cell: other bundles have their own c1.0.
    const cell = [...container.querySelectorAll('.bundle-dataset-cell')].find((c) =>
      c.textContent.includes(bundle.title)
    );

    expect(
      within(cell).queryByText(`Get Collection ${older.collection}`)
    ).not.toBeInTheDocument();

    fireEvent.click(within(cell).getByRole('button', { name: /other versions/i }));
    expect(within(cell).getByText(`Get Collection ${older.collection}`)).toBeInTheDocument();
  });

  test('a single-collection bundle offers no toggle', () => {
    const single = card().datasets.filter((bundle) => bundle.collections.length === 1);
    expect(single.length).toBeGreaterThan(0);
    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    // One toggle per multi-collection bundle, and no more.
    expect(container.querySelectorAll('.other-versions')).toHaveLength(
      card().datasets.filter((b) => b.collections.length > 1).length
    );
  });

  test('the latest collection leads, whatever order the config lists them in', () => {
    const bundle = multi();
    const latest = bundle.collections.find((c) => c.latest);
    expect(bundle.collections.indexOf(latest)).toBeGreaterThan(0);

    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    const cell = [...container.querySelectorAll('.bundle-dataset-cell')].find((c) =>
      c.textContent.includes(bundle.title)
    );
    expect(cell.querySelector('.bundle-dataset-actions').textContent).toContain(
      `Get Collection ${latest.collection}`
    );
  });
});

describe('human-precovid bundles - restricted vs unrestricted', () => {
  const raw = BundleDataTypes.human_precovid_sed_adu;
  const card = (userType) => cardFor('human-precovid-sed-adu', userType);

  test('a bundle with no unrestricted build is withheld from external users', () => {
    // Phenotype is individual-level only; there is no summary-level build of it.
    const restrictedOnly = raw.filter((bundle) =>
      bundle.collections.every((c) => !c.bundleVersions.unrestricted)
    );
    expect(restrictedOnly).toHaveLength(1);

    const titles = (userType) => card(userType).datasets.map((b) => b.title);
    expect(titles('internal')).toContain(restrictedOnly[0].title);
    expect(titles('external')).not.toContain(restrictedOnly[0].title);
    expect(titles(undefined)).not.toContain(restrictedOnly[0].title);
  });

  test('external users are never given a restricted file name', () => {
    const restrictedNames = new Set(
      raw.flatMap((bundle) =>
        bundle.collections.map((c) => c.bundleVersions.restricted?.name).filter(Boolean)
      )
    );
    expect(restrictedNames.size).toBeGreaterThan(0);

    ['external', undefined].forEach((userType) => {
      card(userType).datasets.forEach((bundle) => {
        bundle.collections.forEach((c) => {
          expect(restrictedNames.has(c.name)).toBe(false);
        });
      });
    });
  });

  test('internal users get the restricted build where one exists', () => {
    card('internal').datasets.forEach((bundle) => {
      const source = raw.find((b) => b.title === bundle.title);
      const expected = source.collections[0].bundleVersions.restricted.name;
      expect(bundle.collections[0].name).toBe(expected);
    });
  });

  test('the description follows the build, not the bundle', () => {
    // The restricted build describes individual-level results; the unrestricted
    // one describes summary-level. Showing the wrong text would misrepresent
    // what the download contains.
    const split = raw.find((b) => b.collections[0].bundleVersions.unrestricted);
    const internal = card('internal').datasets.find((b) => b.title === split.title);
    const external = card('external').datasets.find((b) => b.title === split.title);

    expect(internal.description).toBe(split.collections[0].bundleVersions.restricted.description);
    expect(external.description).toBe(
      split.collections[0].bundleVersions.unrestricted.description
    );
    expect(internal.description).not.toBe(external.description);
  });

  test('the resolved collection still carries the size of the build offered', () => {
    // Nothing renders it today, but the model must not hand back the wrong
    // build's size if a caller starts using it again.
    const split = raw.find((b) => b.collections[0].bundleVersions.unrestricted);
    const external = card('external').datasets.find((b) => b.title === split.title);
    expect(external.collections[0].size).toBe(
      split.collections[0].bundleVersions.unrestricted.size
    );
  });

  test('external users see six of the seven bundles', () => {
    expect(card('internal').datasets).toHaveLength(raw.length);
    expect(card('external').datasets).toHaveLength(raw.length - 1);
  });
});

describe('human-precovid bundles - signing in does not widen external access', () => {
  test('an authenticated external user gets exactly what an anonymous visitor gets', () => {
    // Restricted is consortium-only. Being signed in is not the qualification;
    // being internal is.
    const asExternal = cardFor('human-precovid-sed-adu', 'external');
    const asAnonymous = cardFor('human-precovid-sed-adu', undefined);

    const shape = (card) =>
      card.datasets.map((bundle) => ({
        title: bundle.title,
        description: bundle.description,
        files: bundle.collections.map((c) => `${c.name}|${c.size}`),
      }));

    expect(shape(asExternal)).toEqual(shape(asAnonymous));
  });

  test('only internal users are served restricted files', () => {
    const restricted = new Set(
      BundleDataTypes.human_precovid_sed_adu.flatMap((bundle) =>
        bundle.collections.map((c) => c.bundleVersions.restricted?.name).filter(Boolean)
      )
    );
    const served = (userType) =>
      cardFor('human-precovid-sed-adu', userType).datasets.flatMap((b) =>
        b.collections.map((c) => c.name)
      );

    expect(served('internal').filter((n) => restricted.has(n))).toHaveLength(restricted.size);
    expect(served('external').filter((n) => restricted.has(n))).toHaveLength(0);
    expect(served(undefined).filter((n) => restricted.has(n))).toHaveLength(0);
  });
});

describe('BundleDatasetCard - the Other versions toggle matches Study Collections', () => {
  const card = () => cardFor('rat-training-06', 'internal');

  test('the toggle carries the same classes the study cards use', () => {
    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    const toggle = container.querySelector('.other-versions .more-btn');
    expect(toggle).toBeInTheDocument();
    // `.more-btn` inside `.other-versions` is what the shared SCSS rule targets;
    // without both, the toggle falls back to a default blue link.
    expect(toggle.className).toContain('btn-link');
    expect(toggle.closest('.other-versions')).toBeInTheDocument();
  });

  test('expanding shows the same boxed panel with a heading', () => {
    const bundle = card().datasets.find((b) => b.collections.length > 1);
    const { container } = renderWithProviders(<BundleDatasetCard card={card()} profile={{}} />);
    const cell = [...container.querySelectorAll('.bundle-dataset-cell')].find((c) =>
      c.textContent.includes(bundle.title)
    );

    fireEvent.click(within(cell).getByRole('button', { name: /other versions/i }));

    const panel = cell.querySelector('.other-versions-list');
    expect(panel).toBeInTheDocument();
    expect(panel.querySelector('.earlier-collections-heading')).toBeInTheDocument();
    expect(panel.querySelectorAll('.bundle-collection')).toHaveLength(
      bundle.collections.length - 1
    );
  });
});
