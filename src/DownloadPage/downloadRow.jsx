import React from 'react';
import PropTypes from 'prop-types';

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
  let availClass;
  let availIcon;
  switch (upload.availability) {
    case 'Publicly Available': {
      availClass = 'public';
      availIcon = (
        <p className="statusText">
          <span className="iconText">
            Publically Available&nbsp;
          </span>
          <span className="oi oi-circle-check" />
        </p>
      );
      break;
    }
    case 'Internally Available': {
      availClass = 'internal';
      availIcon = (
        <p className="statusText">
          <span className="iconText">
            Internally Available&nbsp;
          </span>
          <span className="oi oi-loop-square" />
        </p>
      );
      break;
    }
    default: {
      availClass = 'pending';
      availIcon = (
        <p className="statusText">
          <span className="iconText">
            Pending Q.C.&nbsp;
          </span>
          <span className="oi oi-ellipses" />
        </p>
      );
      break;
    }
  }
  return (
    <div className={`downloadRow m-2 row ${availClass}`}>
      <div className="col leftSide mt-2">
        <h4>
          {upload.subject === 'Animal' ? <span title="Subject: Animal" className="icon-Animal animal" /> : <span title="Subject: Human" className="icon-Human human" /> }
          {` ID: ${upload.identifier} `}
        </h4>
        <p>
          <span className="heavy">Data Type: </span>
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
