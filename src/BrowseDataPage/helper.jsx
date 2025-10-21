import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrowseDataTable props
 */
export const browseDataPropType = {
  tissue_name: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  tissue_superclass: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  tissue_code: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  assay: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  omics: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  phase: PropTypes.string,
  study: PropTypes.string,
  species: PropTypes.string,
  object: PropTypes.string,
  category: PropTypes.string,
  sub_category: PropTypes.string,
  object_size: PropTypes.number,
  external_release: PropTypes.bool,
  reference_genome: PropTypes.string,
};

function formatBytes(bytes, decimals = 2) {
  // Type checking and coercion
  const numBytes = Number(bytes);

  // Handle invalid inputs
  if (!Number.isFinite(numBytes)) {
    return 'Invalid size';
  }

  // Handle zero
  if (numBytes === 0) {
    return '0 Bytes';
  }

  // Handle negative (defensive)
  const sign = numBytes < 0 ? '-' : '';
  const absoluteBytes = Math.abs(numBytes);

  // Constants
  const UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const BASE = 1024;

  // Calculate unit index (with bounds checking)
  const exponent = Math.min(
    Math.floor(Math.log(absoluteBytes) / Math.log(BASE)),
    UNITS.length - 1
  );

  // Calculate value
  const value = absoluteBytes / Math.pow(BASE, exponent);

  // Format with decimals
  const dm = Math.max(0, Math.min(decimals, 20)); // Clamp decimals between 0-20
  const formattedValue = value.toFixed(dm);

  return (
    <div className="text-right">
      <span className="text-nowrap">
        {`${sign}${formattedValue} ${UNITS[exponent]}`}
      </span>
    </div>
  );
}

/**
 * column headers
 */
export const tableColumns = (userType = null, isPass1b06 = false) => {
  const columns = [
    {
      Header: 'Tissue',
      accessor: 'tissue_name',
      sortType: 'basic',
    },
    {
      Header: 'Assay',
      accessor: 'assay',
      sortType: 'basic',
    },
    {
      Header: 'Omics',
      accessor: 'omics',
      sortType: 'basic',
    },
    {
      Header: 'Intervention',
      accessor: 'study',
    },
    {
      Header: 'Category',
      accessor: 'category',
    },
    {
      Header: 'File',
      accessor: 'filename',
    },
    {
      id: 'filesize',
      Header: 'Size',
      accessor: 'object_size',
      Cell: (row) => formatBytes(row.value),
    },
  ];

  // Add reference genome column if user is internal and viewing pass1b-06 data
  if (userType === 'internal' && isPass1b06) {
    columns.splice(4, 0, {
      Header: 'Assembly',
      accessor: 'reference_genome',
      sortType: 'basic',
    });
  }

  return columns;
};

/**
 * Global filter rendering function
 */
export const GlobalFilter = ({
  preGlobalFilteredRows = [],
  globalFilter = '',
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <div className="form-group d-flex align-items-center justify-content-end">
      <label htmlFor="searchFilterInput">Search:</label>
      <input
        type="text"
        className="form-control"
        id="searchFilterInput"
        value={globalFilter || ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`${count} entries`}
      />
    </div>
  );
};

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.arrayOf(
    PropTypes.shape({ ...browseDataPropType })
  ),
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

/**
 * page count and page index rendering function
 */
export const PageIndex = ({ pageIndex = 0, pageOptions = [] }) => (
  <span className="page-index">
    {pageOptions.length > 0 ? (
      <span>{`Showing Page ${pageIndex + 1} of ${pageOptions.length}`}</span>
    ) : (
      <span>Showing 0 Pages</span>
    )}
  </span>
);

PageIndex.propTypes = {
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.arrayOf(PropTypes.number),
};

/**
 * page size control rendering function
 */
export const PageSize = ({ pageSize, setPageSize, pageSizeOptions }) => (
  <div className="pagination-page-size d-flex align-items-center justify-content-start">
    <label htmlFor="pageSizeSelect">Show:</label>
    <select
      className="form-control"
      id="pageSizeSelect"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
      }}
      disabled={pageSizeOptions.length === 0}
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <span>entries</span>
  </div>
);

PageSize.propTypes = {
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/**
 * page navigation control rendering function
 */
export const PageNavigationControl = ({
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
  pageCount,
}) => (
  <div className="btn-group pagination-navigation-control" role="group">
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canPreviousPage ? 'disabled-btn' : ''
      }`}
      onClick={() => gotoPage(0)}
      disabled={!canPreviousPage}
    >
      First
    </button>{' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canPreviousPage ? 'disabled-btn' : ''
      }`}
      onClick={() => previousPage()}
      disabled={!canPreviousPage}
    >
      Previous
    </button>{' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canNextPage ? 'disabled-btn' : ''
      }`}
      onClick={() => nextPage()}
      disabled={!canNextPage}
    >
      Next
    </button>{' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canNextPage ? 'disabled-btn' : ''
      }`}
      onClick={() => gotoPage(pageCount - 1)}
      disabled={!canNextPage}
    >
      Last
    </button>
  </div>
);

PageNavigationControl.propTypes = {
  canPreviousPage: PropTypes.bool.isRequired,
  canNextPage: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  gotoPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
};

/**
 * Utility function to tranform some fields within each object in the array
 */
export const transformData = (arr) => {
  const tranformArray = [...arr];
  tranformArray.forEach((item) => {
    // Extract file name from object
    const splits = item.object.split('/');
    item.filename = splits.pop();
    // Transform metabolomics assay value
    if (item.assay) {
      const newMetabAssayVal = Array.isArray(item.assay) ? item.assay.join(', ') : item.assay;
      // Applicable to PASS1A-06, PASS1B-06 and HUMAN-PRECOVID-SED-ADU
      if (newMetabAssayVal.includes('Targeted') && newMetabAssayVal.includes('Untargeted')) {
        item.assay = 'Merged';
      }
    }
    // Transform tissue name value
    if (item.tissue_name) {
      if (Array.isArray(item.tissue_name) && item.tissue_name.length) {
        item.tissue_name = '';
      } else if (typeof item.tissue_name === 'string' && item.tissue_name.length) {
        if (
          // Applicable to PASS1A-06 and HUMAN-PRECOVID-SED-ADU
          item.tissue_name.includes('EDTA Plasma') && item.omics.includes('Metabolomics') && item.study.includes('Acute Exercise')
        ) {
          item.tissue_name = 'Plasma';
        } else if (item.phase.includes('HUMAN-PRECOVID-SED-ADU') && item.study.includes('Acute Exercise') && item.tissue_superclass) {
          // Applicable to HUMAN-PRECOVID-SED-ADU
          item.tissue_name = item.tissue_superclass;
        }
      }
    }
    if (item.omics) {
      const newOmicsVal = (Array.isArray(item.omics)) ? item.omics.join(', ') : item.omics;
      // Applicable to PASS1A-06 and HUMAN-PRECOVID-SED-ADU
      if (
        newOmicsVal.includes('Metabolomics Targeted')
        && newOmicsVal.includes('Metabolomics Untargeted')
      ) {
        item.omics = 'Metabolomics';
      }
    }
  });
  return tranformArray;
};
