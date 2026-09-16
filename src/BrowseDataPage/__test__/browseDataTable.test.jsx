import { describe, test, expect } from 'vitest';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../testUtils/test-utils';
import BrowseDataTable from '../browseDataTable';

const noop = () => {};

/** A file row with everything `transformData` reads, overridable per test. */
const file = (overrides = {}) => ({
  object: 'quant-id/rat-training-06/c2.0/file.txt',
  tissue_name: 'Liver',
  assay: 'RNA-seq',
  omics: 'Transcriptomics',
  phase: 'PASS1B-06',
  study: 'Endurance Training',
  species: 'Rat',
  category: 'Quant-ID',
  object_size: 1000,
  external_release: true,
  ...overrides,
});

function renderTable(filteredFiles) {
  return renderWithProviders(
    <BrowseDataTable
      filteredFiles={filteredFiles}
      waitingForResponse={false}
      handleDownloadRequest={noop}
      downloadRequestResponse=""
    />
  );
}

const headers = (container) => [...container.querySelectorAll('.browseDataTable thead th')];

const header = (container, name) =>
  headers(container).find((cell) => cell.textContent.startsWith(name));

const column = (container, name) =>
  [...container.querySelectorAll(`.browseDataTable tbody td.${name}`)].map(
    (cell) => cell.textContent
  );

describe('BrowseDataTable - column sorting', () => {
  test('every data column offers a sort control, and the checkbox column does not', () => {
    // The selection column is a control, not data: sorting it means nothing,
    // and a toggle there would re-sort the table on select-all.
    const { container } = renderTable([file()]);
    const [selection, ...dataColumns] = headers(container);

    expect(selection.querySelector('.material-icons')).toBeNull();
    expect(dataColumns).toHaveLength(9);
    dataColumns.forEach((cell) => {
      expect(cell.querySelector('.material-icons')).not.toBeNull();
    });
  });

  test('clicking a header sorts by it, and clicking again reverses', async () => {
    const user = userEvent.setup();
    const { container } = renderTable([
      file({ tissue_name: 'Liver', assay: 'ATAC-seq' }),
      file({ tissue_name: 'Heart', assay: 'RNA-seq' }),
    ]);
    // Tissue carries the initial sort, so start from a column that does not.
    expect(column(container, 'assay')).toEqual(['RNA-seq', 'ATAC-seq']);

    await user.click(header(container, 'Assay'));
    expect(column(container, 'assay')).toEqual(['ATAC-seq', 'RNA-seq']);

    await user.click(header(container, 'Assay'));
    expect(column(container, 'assay')).toEqual(['RNA-seq', 'ATAC-seq']);
  });

  test('the sorted column says which way it is sorted', async () => {
    const user = userEvent.setup();
    const { container } = renderTable([file()]);
    const assay = () => header(container, 'Assay').querySelector('.material-icons').textContent;

    expect(assay()).toBe('unfold_more');
    await user.click(header(container, 'Assay'));
    expect(assay()).toBe('expand_less');
    await user.click(header(container, 'Assay'));
    expect(assay()).toBe('expand_more');
  });

  test('Size sorts by magnitude, not by how the digits read', async () => {
    // The Cell renders formatted sizes -- "900.00 Bytes", "1.17 KB" -- whose
    // leading digits do not order the way the underlying bytes do. Asserts the
    // sort reads `object_size` and not what the column displays.
    const user = userEvent.setup();
    const { container } = renderTable([
      file({ object_size: 900 }),
      file({ object_size: 100000 }),
      file({ object_size: 1200 }),
    ]);

    await user.click(header(container, 'Size'));
    expect(column(container, 'filesize')).toEqual([
      '900.00 Bytes',
      '1.17 KB',
      '97.66 KB',
    ]);
  });
});
