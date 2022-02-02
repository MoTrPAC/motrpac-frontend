import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';
import {
  trainingResultsTablePropType,
  trainingTableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  TrainingGlobalFilter,
  tissueList,
} from './sharedlib';

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function TrainingResultsTable({ trainingData }) {
  // Define table column headers
  const columns = useMemo(() => trainingTableColumns, []);
  const data = useMemo(() => trainingData, [trainingData]);
  return <TrainingDataTable columns={columns} data={data} />;
}

/**
 * Renders the data qc status table
 *
 * @param {Array} columns Array of column header labels and its data source
 *
 * @returns {object} JSX representation of table on data qc status
 */
function TrainingDataTable({ columns, data }) {
  const [filterMinMaxValues, setFilterMinMaxValues] = useState({
    min: null,
    max: null,
  });
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) =>
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    []
  );

  // Use the useTable hook to create your table configuration
  const instance = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 20,
        pageCount: 10,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
    filterValue,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = instance;

  // default page size options given the length of entries in the data
  const range = (start, stop, step = 20) => Array(Math.ceil(stop / step)).fill(start).map((x, y) => x + y * step);

  const handleCheckboxChange = () => {
    // handle events on multiple checkboxes
    /*
    const checkboxes = document.querySelectorAll(
      'input[type=checkbox][name=timepoint]'
    );
    let filterTimepoints = [];

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        filterTimepoints = Array.from(checkboxes)
          .filter((i) => i.checked)
          .map((i) => i.value);
        setFilter('comparison_group.raw', filterTimepoints);
      });
    });
    */
    const checkboxes = document.querySelectorAll(
      'input[type=checkbox][name=assay]'
    );
    let filterTimepoints = [];
    filterTimepoints = Array.from(checkboxes)
      .filter((i) => i.checked)
      .map((i) => i.value);
    setFilter('assay_name.raw', filterTimepoints);
  };

  // handle events on omics checkboxes
  const handleOmicsCheckboxChange = () => {
    const checkboxes = document.querySelectorAll(
      'input[type=checkbox][name=omics]'
    );
    let filterOmics = [];
    filterOmics = Array.from(checkboxes)
      .filter((i) => i.checked)
      .map((i) => i.value);
    setFilter('omic.raw', filterOmics);
  };

  // render checkboxes for omics
  function renderOmicCheckbox(value, id, label) {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={value}
          id={id}
          name="omics"
          onChange={handleOmicsCheckboxChange.bind(this)}
        />
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="row">
      <div className="search-sidebar-container col-md-2">
        <div className="card">
          <div className="card-header font-weight-bold">Filter results:</div>
          <div className="card-body">
            {/* Omics filter */}
            <div className="filter-omic form-group">
              <label htmlFor="formControlCheckboxes">Omic:</label>
              {renderOmicCheckbox(
                'Epigenomic',
                'filterOmicEpigenomics',
                'Epigenomics'
              )}
              {renderOmicCheckbox(
                'Immunoassay',
                'filterOmicImmunoassay',
                'Immunoassay'
              )}
              {renderOmicCheckbox(
                'Metabolomic-Targeted',
                'filterOmicMetabolomicsTargeted',
                'Metabolomics-Targeted'
              )}
              {renderOmicCheckbox(
                'Metabolomic-Untargeted',
                'filterOmicMetabolomicsUntargeted',
                'Metabolomics-Untargeted'
              )}
              {renderOmicCheckbox(
                'Proteomic',
                'filterOmicProteomics',
                'Proteomics'
              )}
              {renderOmicCheckbox(
                'Transcriptomic',
                'filterOmicTranscriptomics',
                'Transcriptomics'
              )}
            </div>
            {/* Tissue filter */}
            <div className="filter-tissue form-group">
              <label htmlFor="formControlTissue">Tissue:</label>
              <select
                className="form-control custom-filter mt-1"
                id="formControlTissue"
                value={filterValue}
                onChange={(e) => {
                  setFilter('tissue_name.raw', e.target.value || undefined);
                }}
              >
                <option value="">All</option>
                {tissueList.map((tissue) => {
                  return (
                    <option key={tissue} value={tissue}>
                      {tissue}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* Assay filter */}
            <div className="filter-assay form-group mt-3">
              <label htmlFor="formControlCheckboxes">Assay:</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="RNA-seq"
                  id="filterAssayRnaSeq"
                  name="assay"
                  onChange={handleCheckboxChange.bind(this)}
                />
                <label className="form-check-label" htmlFor="filterAssayRnaSeq">
                  RNA-seq
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="ATAC-seq"
                  id="filterAssayAtacSeq"
                  name="assay"
                  onChange={handleCheckboxChange.bind(this)}
                />
                <label
                  className="form-check-label"
                  htmlFor="filterAssayAtacSeq"
                >
                  ATAC-seq
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="PROT"
                  id="filterAssayProt"
                  name="assay"
                  onChange={handleCheckboxChange.bind(this)}
                />
                <label className="form-check-label" htmlFor="filterAssayProt">
                  PROT
                </label>
              </div>
            </div>
            {/* zScore filter */}
            <div className="filter-p-value form-group mt-3">
              <label htmlFor="formControlRange">P-Value:</label>
              <div className="d-flex align-items-center mt-1">
                <input
                  className="form-control custom-filter mr-2"
                  value={filterMinMaxValues.min || ''}
                  type="number"
                  step="0.01"
                  min="-5"
                  max="5"
                  onChange={(e) => {
                    const minVal = e.target.value;
                    setFilterMinMaxValues({
                      ...filterMinMaxValues,
                      min: minVal,
                    });
                    setFilter('p_value.raw', (old = []) => [
                      minVal ? parseFloat(minVal) : undefined,
                      old[1],
                    ]);
                  }}
                />
                <span>to</span>
                <input
                  className="form-control custom-filter ml-2"
                  value={filterMinMaxValues.max || ''}
                  type="number"
                  step="0.01"
                  min="-5"
                  max="5"
                  onChange={(e) => {
                    const maxVal = e.target.value;
                    setFilterMinMaxValues({
                      ...filterMinMaxValues,
                      max: maxVal,
                    });
                    setFilter('p_value.raw', (old = []) => [
                      old[0],
                      maxVal ? parseFloat(maxVal) : undefined,
                    ]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="search-results-container col-md-10">
        <div className="d-flex align-items-center justify-content-between">
          <PageSize
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageSizeOptions={range(20, preGlobalFilteredRows.length)}
          />
          <TrainingGlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <div className="card mb-3">
          <div className="card-body table-ui-wrapper">
            <div className="table-responsive">
              <table
                {...getTableProps()}
                className="table table-sm timewiseDEATable"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      className="table-head"
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {column.render('Header')}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <i className="material-icons">expand_more</i>
                                  : <i className="material-icons">expand_less</i>
                                : <i className="material-icons">unfold_more</i>}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className={cell.value}>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="pagination-footer d-flex align-items-center justify-content-between">
          <PageIndex pageIndex={pageIndex} pageOptions={pageOptions} />
          <PageNavigationControl
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={previousPage}
            nextPage={nextPage}
            gotoPage={gotoPage}
            pageCount={pageCount}
          />
        </div>
      </div>
    </div>
  );
}

TrainingResultsTable.propTypes = {
  trainingData: PropTypes.arrayOf(
    PropTypes.shape({ ...trainingResultsTablePropType })
  ).isRequired,
};

TrainingDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...trainingResultsTablePropType }))
    .isRequired,
};

export default TrainingResultsTable;
