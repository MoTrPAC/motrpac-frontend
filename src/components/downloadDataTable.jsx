import React from 'react';
import PropTypes from 'prop-types';
import DownloadRow from './downloadRow';

function DownloadDataTable({
  filteredUploads,
  onCartClick,
  cartItems,
  viewCart,
  listUpdating,
  siteName,
}) {
  // TODO: Find out how actual downloading works
  if (filteredUploads.length === 0) {
    return (
      <div className="noData col">
        <h2>
          No Downloadable Data Available
        </h2>
      </div>
    );
  }
  if (listUpdating) {
    return (
      <div className="downloadTable updating col">
        <h2>
          Updating List...
        </h2>
        <span className="oi loadIndicator oi-loop-circular" />
      </div>
    );
  }
  let displayedUploads = [...filteredUploads];
  if (viewCart) {
    displayedUploads = [...cartItems];
  }
  const uploadList = displayedUploads
    .map((upload) => {
      const inCart = !(cartItems.indexOf(upload) === -1);
      return (
        <DownloadRow
          key={upload.identifier + upload.type}
          upload={upload}
          onCartClick={onCartClick}
          inCart={inCart}
          siteName={siteName}
        />
      );
    });

  return (
    <div className="col downloadTable">
      {viewCart ? <h4 className="viewCartTitle">Your Cart</h4> : ''}
      {uploadList}
    </div>
  );
}
DownloadDataTable.propTypes = {
  filteredUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  viewCart: PropTypes.bool.isRequired,
  listUpdating: PropTypes.bool.isRequired,
  onCartClick: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
};
DownloadDataTable.defaultProps = {
};


export default DownloadDataTable;
