import React from 'react';
import WeightGainPlot from './plots/weightGain';
import BodyFatChangePlot from './plots/bodyFatChange';
import VO2MaxChangePlot from './plots/vo2MaxChange';
import LactateChangePlot from './plots/lactateChange';

/**
 * Functional component to render animal pass1b-06 phenotype data visualization
 *
 * @return {Object} JSX representation of the animal phenotype data visualization
 */
function Pass1b06PhenotypeAnimal() {
  return (
    <div>
      <div className="card-container-phenotype-animal row mb-4">
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="internal-user-labels float-right">
                <span className="badge badge-secondary ml-2">
                  PASS1B 6-Month
                </span>
              </div>
              <div className="card-title mb-0">Post-Training Weight Change</div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <WeightGainPlot />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="internal-user-labels float-right">
                <span className="badge badge-secondary ml-2">
                  PASS1B 6-Month
                </span>
              </div>
              <div className="card-title mb-0">
                Post-Training Body Fat Change
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <BodyFatChangePlot />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-container-phenotype-animal row mb-4">
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="internal-user-labels float-right">
                <span className="badge badge-secondary ml-2">
                  PASS1B 6-Month
                </span>
              </div>
              <div className="card-title mb-0">
                Post-Training VO2 Max Change
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <VO2MaxChangePlot />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-lg-6">
          <div className="flex-fill w-100 card shadow-sm">
            <h5 className="card-header">
              <div className="internal-user-labels float-right">
                <span className="badge badge-secondary ml-2">
                  PASS1B 6-Month
                </span>
              </div>
              <div className="card-title mb-0">
                Post-Training Lactate Change
              </div>
            </h5>
            <div className="card-body pt-1">
              <div className="phenotype-plot">
                <LactateChangePlot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pass1b06PhenotypeAnimal;
