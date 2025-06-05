import React from 'react';
import PropTypes from 'prop-types';

function SubAnalysisCard({ subAnalysis, onPickSubAnalysis }) {
  // Common markup
  const analysisCardContent = (
    <div className="row no-gutters h-100">
      <div className="col-md-4 d-flex align-items-center pl-4">
        <img
          src={subAnalysis.active ? subAnalysis.icon : subAnalysis.inactiveIcon}
          className="card-img"
          alt={subAnalysis.title}
        />
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <h5 className="card-title">{subAnalysis.title}</h5>
          <p className="card-text">{subAnalysis.description}</p>
          {subAnalysis.input && (
            <p className="card-text">
              <small className="text-muted">
                <strong>Input: </strong>
                {subAnalysis.input}
              </small>
            </p>
          )}
          {!subAnalysis.active && (
            <span className="badge badge-warning">Available soon</span>
          )}
        </div>
      </div>
    </div>
  );

  if (!subAnalysis.active) {
    return (
      <div className="col mb-4">
        <div
          className="card h-100 shadow-sm subAnalysis inactiveAnalysis"
          id={subAnalysis.shortName}
        >
          {analysisCardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="col mb-4">
      <div
        className="card h-100 shadow-sm subAnalysis activeAnalysis"
        onClick={onPickSubAnalysis.bind(
          this,
          subAnalysis.shortName,
          subAnalysis.title
        )}
        onKeyPress={onPickSubAnalysis.bind(
          this,
          subAnalysis.shortName,
          subAnalysis.title
        )}
        tabIndex={0}
        role="button"
      >
        {analysisCardContent}
      </div>
    </div>
  );
}

SubAnalysisCard.propTypes = {
  subAnalysis: PropTypes.shape({
    title: PropTypes.string,
    input: PropTypes.string,
    description: PropTypes.string,
    shortName: PropTypes.string,
    icon: PropTypes.string,
    inactiveIcon: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
  onPickSubAnalysis: PropTypes.func.isRequired,
};

export default SubAnalysisCard;
