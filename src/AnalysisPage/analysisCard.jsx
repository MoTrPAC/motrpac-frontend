import React from 'react';
import PropTypes from 'prop-types';

function AnalysisCard({ analysisType, onPickAnalysis }) {
  // Common markup
  const analysisCardContent = (
    <div className="row no-gutters h-100">
      <div className="col-md-4 d-flex align-items-center pl-4">
        <img
          src={
            analysisType.active ? analysisType.icon : analysisType.inactiveIcon
          }
          className="card-img"
          alt={analysisType.title}
        />
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <h5 className="card-title">{analysisType.title}</h5>
          <p className="card-text">{analysisType.description}</p>
          {analysisType.input && (
            <p className="card-text">
              <small className="text-muted">
                <strong>Input: </strong>
                {analysisType.input}
              </small>
            </p>
          )}
          {!analysisType.active && (
            <span className="badge badge-warning">Available soon</span>
          )}
        </div>
      </div>
    </div>
  );

  if (!analysisType.active) {
    return (
      <div className="col mb-4">
        <div
          className="card h-100 shadow-sm analysisType inactiveAnalysis"
          id={analysisType.shortName}
        >
          {analysisCardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="col mb-4">
      <div
        className="card h-100 shadow-sm analysisType activeAnalysis"
        id={analysisType.shortName}
        onClick={onPickAnalysis.bind(
          this,
          analysisType.shortName,
          analysisType.title
        )}
        onKeyPress={onPickAnalysis.bind(
          this,
          analysisType.shortName,
          analysisType.title
        )}
        tabIndex={0}
        role="button"
        title={analysisType.title}
      >
        {analysisCardContent}
      </div>
    </div>
  );
}

AnalysisCard.propTypes = {
  analysisType: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    input: PropTypes.string,
    shortName: PropTypes.string,
    icon: PropTypes.string,
    inactiveIcon: PropTypes.string,
    active: PropTypes.bool,
    subAnalysis: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onPickAnalysis: PropTypes.func.isRequired,
};

export default AnalysisCard;
