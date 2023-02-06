import React, { useMemo, useEffect, forwardRef, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useRowSelect,
} from 'react-table';
import {
  geneSearchTrainingResultsTablePropType,
  geneSearchTimewisePlotPropType,
  geneSearchTrainingTableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  transformData,
} from './sharedlib';
import TimeSeriesPlots from './timeSeriesPlots';

// React-Table row selection setup
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function GeneCentricTrainingResultsTable({
  trainingData,
  timewiseData,
  geneSymbol,
}) {
  // Define table column headers
  const columns = useMemo(() => geneSearchTrainingTableColumns, []);
  const data = useMemo(() => transformData(trainingData), [trainingData]);
  return (
    <TrainingDataTable
      columns={columns}
      data={data}
      plotData={timewiseData}
      geneSymbol={geneSymbol}
    />
  );
}

/**
 * Renders the data qc status table
 *
 * @param {Array} columns Array of column header labels and its data source
 *
 * @returns {object} JSX representation of table on data qc status
 */
function TrainingDataTable({ columns, data, plotData, geneSymbol }) {
  const [selectedFeatures, setSelectedFeatures] = useState([]);

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
        pageSize: 50,
        pageCount: Math.ceil(data / 50),
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
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
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = instance;

  // default page size options given the length of entries in the data
  const range = (start, stop, step = 50) => Array(Math.ceil(stop / step)).fill(start).map((x, y) => x + y * step);

  // Render modal
  function renderModal() {
    return (
      <div
        className="modal fade time-series-plot-modal"
        id="timeSeriesPlotModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="timeSeriesPlotModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="timeSeriesPlotModalTitle">
                Time Series Plots
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <TimeSeriesPlots
                plotData={plotData}
                selectedFeatures={selectedFeatures}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  /* End: Download modal */

  function handleViewPlots(selectedFiles) {
    if (selectedFiles.length === 0) {
      return false;
    }
    const features = selectedFiles.map((item) => {
      return {
        featureId: item.original.feature_ID,
        tissue: item.original.tissue,
        assay: item.original.assay,
        gene_symbol: item.original.gene_symbol_raw,
        p_value: item.original.p_value,
      };
    });
    setSelectedFeatures(features);
  }

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="search-results-container">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={range(50, preGlobalFilteredRows.length)}
        />
        <div className="search-results-usage-instructions font-weight-bold">
          Select up to 10 features to view time series plots
        </div>
        <div className="view-plots-button">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            disabled={Object.keys(selectedRowIds).length === 0}
            data-toggle="modal"
            data-target=".time-series-plot-modal"
            onClick={() => {
              handleViewPlots(selectedFlatRows);
            }}
          >
            <span className="material-icons mr-1">equalizer</span>
            <span>View time series plots</span>
          </button>
          {Object.keys(selectedRowIds).length > 0 ? renderModal() : null}
        </div>
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
                          column.getSortByToggleProps({ title: '' })
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
                        <td
                          {...cell.getCellProps()}
                          className={cell.value ? cell.value : ''}
                        >
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
  );
}

GeneCentricTrainingResultsTable.propTypes = {
  trainingData: PropTypes.arrayOf(
    PropTypes.shape({ ...geneSearchTrainingResultsTablePropType })
  ).isRequired,
  timewiseData: PropTypes.arrayOf(
    PropTypes.shape({ ...geneSearchTimewisePlotPropType })
  ).isRequired,
  geneSymbol: PropTypes.string.isRequired,
};

TrainingDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({ ...geneSearchTrainingResultsTablePropType })
  ).isRequired,
  plotData: PropTypes.arrayOf(
    PropTypes.shape({ ...geneSearchTimewisePlotPropType })
  ).isRequired,
  geneSymbol: PropTypes.string.isRequired,
};

export default GeneCentricTrainingResultsTable;
