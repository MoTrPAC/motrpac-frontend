import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

function SelectiveDataDownloadsCard({
  cardIcon,
  cardTitle,
  dataSelectHandler,
  selectedData,
  cssSelector,
  children,
}) {
  const navigate = useNavigate();

  function handleDataSelect(e) {
    e.preventDefault();
    dataSelectHandler();
    navigate('/data-download/file-browser', {
      state: { selectedData },
    });
  }

  return (
    <div
      className={`card mb-4 shadow-sm selective-data-downloads-card ${cssSelector}`}
    >
      <div className="card-header">
        <h4 className="my-0 font-weight-normal d-flex align-items-center justify-content-center">
          <span className="material-icons mr-1">{cardIcon}</span>
          <span>{cardTitle}</span>
        </h4>
      </div>
      <div className="card-body">
        {children}
        <button
          type="button"
          className="btn btn-lg btn-block btn-primary"
          onClick={(e) => handleDataSelect(e)}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

SelectiveDataDownloadsCard.propTypes = {
  cardIcon: PropTypes.string.isRequired,
  cardTitle: PropTypes.string.isRequired,
  dataSelectHandler: PropTypes.func.isRequired,
  selectedData: PropTypes.string,
  cssSelector: PropTypes.string,
};

SelectiveDataDownloadsCard.defaultProps = {
  selectedData: '',
  cssSelector: '',
};

export default SelectiveDataDownloadsCard;
