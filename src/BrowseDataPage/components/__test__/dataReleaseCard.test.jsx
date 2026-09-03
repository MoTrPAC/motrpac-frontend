import { describe, test, expect, vi } from 'vitest';
import { screen, fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import DataReleaseCards, { STAGE_SECTIONS } from '../dataReleaseCard';
import studyDataCards, { humanPhenotypeDataCards } from '../../../lib/studyDataCards';
import { allVersions, hasVisibleCollections, versionStages } from '../../../lib/studyDataAccess';

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

function countCollections(stage) {
  return studyDataCards.reduce(
    (total, study) =>
      total
      + Object.values(study.dataTypes).reduce(
        (subtotal, entries) =>
          subtotal
          + allVersions(entries).filter((v) => versionStages(v).includes(stage)).length,
        0
      ),
    0
  );
}

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

    // Counted from the config rather than hardcoded: a magic number breaks every
    // time a collection is declared, which says nothing about whether the count
    // logic is right.
    const publicSection = screen.getByRole('region', { name: /^public release$/i });
    expect(
      within(publicSection).getByText(`${countCollections('public')} collections`)
    ).toBeInTheDocument();

    const consortiumSection = screen.getByRole('region', { name: /^consortium release$/i });
    expect(
      within(consortiumSection).getByText(`${countCollections('consortium')} collections`)
    ).toBeInTheDocument();
    // The count must reflect the rendered collections, not just any number.
    expect(within(consortiumSection).getAllByRole('button', { name: /browse files/i }).length)
      .toBeGreaterThan(0);
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

describe('DataReleaseCards - every collection an internal user may see is rendered', () => {
  test('no collection is stranded without a section to appear in', () => {
    // Early-access collections used to be invisible here: there were only
    // Public and Consortium sections, so the seven `early` collections had
    // nowhere to render. Compared by count across every section, because a
    // collection released at two stages appears under both.
    const cards = [...studyDataCards, ...humanPhenotypeDataCards];
    render(
      <DataReleaseCards studies={cards} userType="internal" onBrowseFiles={() => {}} />
    );

    const declared = cards.flatMap((card) =>
      Object.values(card.dataTypes).flatMap((entries) => allVersions(entries))
    );
    // Only stages that have a section can place a collection; early access
    // deliberately has none.
    const sectionKeys = STAGE_SECTIONS.map((section) => section.key);
    const placements = declared.reduce(
      (total, version) =>
        total + versionStages(version).filter((stage) => sectionKeys.includes(stage)).length,
      0
    );

    const shown = [...document.querySelectorAll('.data-release-count')].reduce(
      (total, el) => total + Number(el.textContent.trim().split(' ')[0]),
      0
    );
    expect(shown).toBe(placements);
  });

  test('there is no Early Access section, for any user', () => {
    // Early-access data is not distributed through the data download feature.
    ['internal', 'external'].forEach((userType) => {
      const { unmount } = render(
        <DataReleaseCards studies={studyDataCards} userType={userType} onBrowseFiles={() => {}} />
      );
      expect(screen.queryByRole('heading', { name: /^early access$/i })).not.toBeInTheDocument();
      unmount();
    });
  });
});

describe('DataReleaseCards - sub-collections stay apart', () => {
  test('two series at the same collection number are not folded together', () => {
    // human-main phenotype holds human-main-sed-adu c2.0 and human-all-ped c2.0.
    // Flattening them presented one as an earlier version of the other, and
    // collided on the React key.
    const humanMain = studyDataCards.filter((s) => s.code === 'human-main');
    render(<DataReleaseCards studies={humanMain} userType="internal" onBrowseFiles={() => {}} />);

    // Listed once, under Consortium: a mixed collection is placed on the
    // strength of its released files, and there is no Early Access section.
    expect(screen.getAllByText('human-main-sed-adu')).toHaveLength(1);
    expect(screen.getAllByText('human-all-ped')).toHaveLength(1);
    // Neither is presented as an "earlier collection" of the other.
    expect(screen.queryByRole('button', { name: /other collections/i })).not.toBeInTheDocument();
  });
});
