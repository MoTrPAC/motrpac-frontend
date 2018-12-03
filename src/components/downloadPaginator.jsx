import React from 'react';
import PropTypes from 'prop-types';

function DownloadPaginator({
  currentPage,
  maxRows,
  onChangePage,
  uploadCount,
}) {
  const PrevBtn = (
    <button type="button" className="btn prevBtn" onClick={() => onChangePage(currentPage - 1)}>
      <span className="oi oi-arrow-thick-left" />
    </button>
  );
  const NextBtn = (
    <button type="button" className="btn nextBtn" onClick={() => onChangePage(currentPage + 1)}>
      <span className="oi oi-arrow-thick-right" />
    </button>
  );
  const lastPage = Math.ceil(uploadCount / maxRows);
  return (
    <div className="downloadPaginator row">
      <div className="col">
        {currentPage !== 1 && PrevBtn}
        {currentPage}
        &nbsp;of&nbsp;
        {lastPage}
        {currentPage !== lastPage && NextBtn}
      </div>
    </div>
  );
}

DownloadPaginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  filteredUploads: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  maxRows: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export default DownloadPaginator;
