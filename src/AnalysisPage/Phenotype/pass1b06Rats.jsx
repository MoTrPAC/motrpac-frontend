import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AnalysisActions from '../analysisActions';
import WeightGainPlot from '../plots/weightGain';
import BodyFatChangePlot from '../plots/bodyFatChange';
import VO2MaxChangePlot from '../plots/vo2MaxChange';
import LactateChangePlot from '../plots/lactateChange';
import PhenotypePlotControls from '../plots/phenotypePlotControls';

function PhenotypePass1b06Rats({
  weightPlot = 'one_week_program',
  bodyFatPlot = 'one_week_program',
  vo2Plot = 'one_week_program',
  lactatePlot = 'one_week_program',
  toggleWeightPlot,
  toggleBodyFatPlot,
  toggleVo2Plot,
  toggleLactatePlot,
}) {
  return (
    <div className="analysis-phenotype-container pass1b-06">
      <div className="analysis-phenotype-summary-container row mb-4">
        <div className="lead col-12">
          Examine the effect of training through a variety of phenotypic data
          collected from the Endurance Exercise Training young adult (6 months)
          rats. <span className="font-weight-bold">Input:</span> Sex, Weight, %
          Body Fat and VO2 Max.
        </div>
      </div>
      <div className="card-container-phenotype-animal row mb-4">
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="plot-control-menu float-right">
                <PhenotypePlotControls
                  togglePlot={toggleWeightPlot}
                  plot={weightPlot}
                />
              </div>
              <div className="card-title mb-0 d-flex align-items-center">
                <span>Effect of training on body weight</span>
                <span className="badge badge-secondary badge-phase ml-2">
                  PASS1B 6-Month
                </span>
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <WeightGainPlot plot={weightPlot} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="plot-control-menu float-right">
                <PhenotypePlotControls
                  togglePlot={toggleBodyFatPlot}
                  plot={bodyFatPlot}
                />
              </div>
              <div className="card-title mb-0 d-flex align-items-center">
                <span>Effect of training on body fat</span>
                <span className="badge badge-secondary badge-phase ml-2">
                  PASS1B 6-Month
                </span>
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <BodyFatChangePlot plot={bodyFatPlot} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-container-phenotype-animal row mb-4">
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="plot-control-menu float-right">
                <PhenotypePlotControls
                  togglePlot={toggleVo2Plot}
                  plot={vo2Plot}
                />
              </div>
              <div className="card-title mb-0 d-flex align-items-center">
                <span>Effect of training on VO2 Max</span>
                <span className="badge badge-secondary badge-phase ml-2">
                  PASS1B 6-Month
                </span>
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <VO2MaxChangePlot plot={vo2Plot} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="plot-control-menu float-right">
                <PhenotypePlotControls
                  togglePlot={toggleLactatePlot}
                  plot={lactatePlot}
                />
              </div>
              <div className="card-title mb-0 d-flex align-items-center">
                <span>Effect of training on blood lactate</span>
                <span className="badge badge-secondary badge-phase ml-2">
                  PASS1B 6-Month
                </span>
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <LactateChangePlot plot={lactatePlot} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PhenotypePass1b06Rats.propTypes = {
  weightPlot: PropTypes.string,
  bodyFatPlot: PropTypes.string,
  vo2Plot: PropTypes.string,
  lactatePlot: PropTypes.string,
  toggleWeightPlot: PropTypes.func.isRequired,
  toggleBodyFatPlot: PropTypes.func.isRequired,
  toggleVo2Plot: PropTypes.func.isRequired,
  toggleLactatePlot: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ...state.analysis,
});

const mapDispatchToProps = (dispatch) => ({
  toggleWeightPlot: (weightPlot) =>
    dispatch(AnalysisActions.toggleWeightPlot(weightPlot)),
  toggleBodyFatPlot: (bodyFatPlot) =>
    dispatch(AnalysisActions.toggleBodyFatPlot(bodyFatPlot)),
  toggleVo2Plot: (vo2Plot) => dispatch(AnalysisActions.toggleVo2Plot(vo2Plot)),
  toggleLactatePlot: (lactatePlot) =>
    dispatch(AnalysisActions.toggleLactatePlot(lactatePlot)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhenotypePass1b06Rats);
