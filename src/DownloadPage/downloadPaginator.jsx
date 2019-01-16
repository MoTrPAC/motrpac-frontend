import React from 'react';
import PropTypes from 'prop-types';

function DownloadPaginator({
  currentPage,
  maxRows,
  onChangePage,
  uploadCount,
  viewCart,
}) {
  if (viewCart) {
    return <div />;
  }
  const lastPage = Math.ceil(uploadCount / maxRows);
  const PrevBtn = (
    <button type="button" className="btn prevBtn" onClick={() => onChangePage(maxRows, currentPage - 1)}>
      <span className="oi oi-arrow-thick-left" />
    </button>
  );
  const NextBtn = (
    <button type="button" className="btn nextBtn" onClick={() => onChangePage(maxRows, currentPage + 1)}>
      <span className="oi oi-arrow-thick-right" />
    </button>
  );
  function FirstLastBtn() {
    return (
      <div className="firstLastBtn">
        {currentPage !== 1 && (
          <button type="button" className="btn" onClick={() => onChangePage(maxRows, 1)}>
            1
          </button>
        )}
        {(lastPage > currentPage) && (
          <button type="button" className="btn" onClick={() => onChangePage(maxRows, lastPage)}>
            {lastPage}
          </button>
        )
        }
      </div>
    );
  }
  return (
    <div className="downloadPaginator centered row">
      <div className="col">
        {currentPage !== 1 && PrevBtn}
        <FirstLastBtn />
        {!(currentPage === lastPage || lastPage === 0) && NextBtn}
        <p>
          Page&nbsp;
          {currentPage}
          &nbsp;of&nbsp;
          {lastPage}
        </p>
        <p>
          Total Results:&nbsp;
          {uploadCount}
        </p>
      </div>
    </div>
  );
}

DownloadPaginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  maxRows: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  uploadCount: PropTypes.number.isRequired,
  viewCart: PropTypes.bool.isRequired,
};

export default DownloadPaginator;
