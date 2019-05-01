import React from 'react';
import PropTypes from 'prop-types';
import downloadFilters from '../lib/downloadFilters';

// Dictionary mapping availability status to icons
const statusOptions = downloadFilters[1];

/**
 * Returns text and an icon given the status of an upload.
 *
 * @param {String} availability The status of an uploaded item in the pipeline
 * @param {Boolean} short Returned icon will not include surrounding text it true
 *
 * @returns {Array[String,Object]} The text status, and JSX object
 * for representing availability of item
 */
export function getStatusIcon(availability, short = false) {
  let availClass;
  let availIcon;
  switch (availability) {
    case statusOptions.filters[0]: {
      availClass = 'public';
      availIcon = short ? <span className={`availIcon ${statusOptions.icons[0]}`} /> : (
        <p className="statusText">
          <span className="iconText">
            {statusOptions.filters[0]}
            &nbsp;
          </span>
          <span className={statusOptions.icons[0]} />
        </p>
      );
      break;
    }
    case 'Internally Available': {
      availClass = 'internal';
      availIcon = short ? <span className={`availIcon ${statusOptions.icons[1]}`} /> : (
        <p className="statusText">
          <span className="iconText">
            {statusOptions.filters[1]}
            &nbsp;
          </span>
          <span className={statusOptions.icons[1]} />
        </p>
      );
      break;
    }
    default: {
      availClass = 'pending';
      availIcon = short ? <span className={`availIcon ${statusOptions.icons[2]}`} /> : (
        <p className="statusText">
          <span className="iconText">
            {statusOptions.filters[2]}
            &nbsp;
          </span>
          <span className={statusOptions.icons[2]} />
        </p>
      );
      break;
    }
  }
  return [availClass, availIcon];
}


function DownloadRow({
  upload,
  onCartClick,
  inCart,
  siteName,
}) {
  const downloadable = !((upload.availability === 'Pending Q.C.') && (upload.site !== siteName));
  function DownloadBtn() {
    return (
      <button title={inCart ? 'Remove from Cart' : 'Add To Cart'} className={`btn downloadBtn ${inCart && 'inCart'}`} type="button" onClick={() => onCartClick(upload)}>
        <span className="oi oi-cart" />
      </button>
    );
  }
  const [availClass, availIcon] = getStatusIcon(upload.availability);

  return (
    <div className={`downloadRow m-2 row ${availClass}`}>
      <div className="col leftSide mt-2">
        <h4>
          {upload.subject === 'Animal' ? <span title="Subject: Animal" className="icon-Animal animal" /> : <span title="Subject: Human" className="icon-Human human" /> }
          {` ID: ${upload.identifier} `}
        </h4>
        <p>
          <span className="heavy">Assay Type: </span>
          {upload.type}
        </p>
        <p className="endP">
          <span className="heavy">Uploaded: </span>
          {upload.date}
          &nbsp;by&nbsp;
          <span className="siteName">{upload.site}</span>
        </p>
      </div>
      <div className="col col-auto d-flex flex-column justify-content-between">
        <div className="row rightAlign">
          <div className="col mt-2">
            {downloadable ? <DownloadBtn /> : <p title="Data are pending Q.C. and are not from your site" className="noDownload">Currently Unavailable</p>}
          </div>
        </div>
        <div className="row rightAlign">
          <div className="col">
            {availIcon}
          </div>
        </div>
      </div>
    </div>
  );
}

DownloadRow.propTypes = {
  upload: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
  }).isRequired,
  inCart: PropTypes.bool.isRequired,
  onCartClick: PropTypes.func.isRequired,
  siteName: PropTypes.string,
};

DownloadRow.defaultProps = {
  siteName: '',
};

export default DownloadRow;
