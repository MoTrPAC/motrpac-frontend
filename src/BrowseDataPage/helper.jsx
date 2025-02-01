import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrowseDataTable props
 */
export const browseDataPropType = {
  tissue_name: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  tisseu_superclass: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
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
};

function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    <div className="text-right">
      <span className="text-nowrap">
        {parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + sizes[i]}
      </span>
    </div>
  );
}

/**
 * column headers
 */
export const tableColumns = [
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

/**
 * Global filter rendering function
 */
export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
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

GlobalFilter.defaultProps = {
  globalFilter: '',
  preGlobalFilteredRows: [],
};

/**
 * page count and page index rendering function
 */
export const PageIndex = ({ pageIndex, pageOptions }) => (
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

PageIndex.defaultProps = {
  pageIndex: 0,
  pageOptions: [],
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
    if (item.assay !== null && item.assay !== undefined) {
      let newMetabAssayVal = item.assay;
      // convert value to string if it is an array
      if (Array.isArray(newMetabAssayVal)) {
        newMetabAssayVal = newMetabAssayVal.join(', ');
      }
      if (
        newMetabAssayVal.includes('Targeted')
        && newMetabAssayVal.includes('Untargeted')
      ) {
        newMetabAssayVal = 'Merged';
        item.assay = newMetabAssayVal;
      }
    }
    if (
      item.assay !== null
      && item.assay !== undefined
      && item.omics === 'Metabolomics Targeted'
    ) {
      let newMetabAssayVal = item.assay;
      if (
        newMetabAssayVal.includes('Acylcarnitines')
        && newMetabAssayVal.includes('Oxylipins')
      ) {
        newMetabAssayVal = 'Merged';
        item.assay = newMetabAssayVal;
      }
    }
    // Transform tissue name value
    if (item.tissue_name !== null && item.tissue_name !== undefined) {
      let newTissueVal = item.tissue_name;
      // convert value to string if it is an array
      if (Array.isArray(newTissueVal)) {
        newTissueVal = newTissueVal.join(', ');
      }
      // Transform tissue name value
      const tissueMappings = {
        'Human PBMC': 'Blood',
        'Human EDTA Packed Cells': 'Blood',
        'Human PAXgene RNA': 'Blood',
        'Human Adipose': 'Adipose',
        'Human Adipose Powder': 'Adipose',
        'Human Muscle': 'Muscle',
        'Human Muscle Powder': 'Muscle',
        'Human EDTA Plasma': 'Plasma',
      };

      Object.keys(tissueMappings).forEach((key) => {
        if (newTissueVal.indexOf(key) !== -1) {
          newTissueVal = tissueMappings[key];
          item.tissue_name = newTissueVal;
        }
      });
      if (
        newTissueVal.includes('EDTA Plasma')
        && item.omics.includes('Metabolomics')
        && item.study.includes('Acute Exercise')
      ) {
        newTissueVal = 'Plasma';
        item.tissue_name = newTissueVal;
      }
    }
    if (item.omics !== null && item.omics !== undefined) {
      let newOmicsVal = item.omics;
      // convert value to string if it is an array
      if (Array.isArray(newOmicsVal)) {
        newOmicsVal = newOmicsVal.join(', ');
      }
      if (
        newOmicsVal.includes('Metabolomics Targeted')
        && newOmicsVal.includes('Metabolomics Untargeted')
      ) {
        newOmicsVal = 'Metabolomics';
        item.omics = newOmicsVal;
      }
    }
  });
  return tranformArray;
};
