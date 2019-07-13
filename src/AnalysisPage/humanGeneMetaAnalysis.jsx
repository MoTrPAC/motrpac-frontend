import React, { useState } from 'react';
import HumanMetaAnalysisAcuteMuscleGenes from '../data/humanMetaAnalysisAcuteMuscleGenes';

import PlotFOXO1 from '../assets/plots/analysis/meta-analysis/human/acute-muscle/FOXO1.png';
import PlotID1 from '../assets/plots/analysis/meta-analysis/human/acute-muscle/ID1.png';
import PlotPPARGC1A from '../assets/plots/analysis/meta-analysis/human/acute-muscle/PPARGC1A.png';
import PlotSMAD3 from '../assets/plots/analysis/meta-analysis/human/acute-muscle/SMAD3.png';
import PlotVEGFA from '../assets/plots/analysis/meta-analysis/human/acute-muscle/VEGFA.png';

const plotMapping = {
  FOXO1: PlotFOXO1,
  ID1: PlotID1,
  PPARGC1A: PlotPPARGC1A,
  SMAD3: PlotSMAD3,
  VEGFA: PlotVEGFA,
};

const humanMetaAnalysisAcuteMuscleGeneStats = require('../data/human_meta_analysis_acute_muscle_gene_stats');

/**
 * Functional component to render human meta-analysis acute muscle data visualization
 * It uses internal states not shared by other components
 *
 * @return {Object} JSX representation of the meta analysis data visualization
 */
function HumanGeneMetaAnalysis() {
  // Local states
  const [inputValue, setInputValue] = useState('');
  const [gene, setGene] = useState('');

  /**
   * Simple Math.round method
   * alternative #1 - Math.round(num * 10) / 10; //*** returns 1 decimal
   * alternative #2 - Math.round((num + 0.00001) * 100) / 100; //*** returns 2 decimals
   */
  const classificationMathRound = (number, decimals) => {
    return Number(Math.round(number + ('e' + decimals)) + ('e-' + decimals));
  };

  const geneObj = humanMetaAnalysisAcuteMuscleGeneStats
    .find(item => item.Symbol === gene.toUpperCase());

  // Renders found gene stats info in the gene search panel
  const renderGeneInfo = () => {
    if (geneObj && Object.keys(geneObj).length) {
      const geneObjClone = Object.assign({}, geneObj);
      delete geneObjClone.Summary;

      return (
        <div className="gene-search-result">
          <table className="table table-borderless table-striped">
            <tbody>
              {Object.entries(geneObjClone).map(([key, value]) => {
                return (
                  <tr>
                    <th scope="row">{`${key}:`}</th>
                    <td>{parseFloat(value) ? classificationMathRound(Number(value), 2) : value}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="2">
                  <div className="font-weight-bold">Summary:</div>
                  {geneObj.Summary}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return <div className="gene-search-result">No matching gene found.</div>;
  };

  const geneAanlysisDataArray = HumanMetaAnalysisAcuteMuscleGenes[gene.toUpperCase()]
    ? HumanMetaAnalysisAcuteMuscleGenes[gene.toUpperCase()] : null;

  // Renders table head of gene meta-analysis
  const renderMetaAnalysisTableHead = () => {
    return (
      <tr className="table-head">
        <th scope="col" className="gene-meta-analysis-label text-nowrap">Cohort ID</th>
        <th scope="col" className="gene-meta-analysis-label text-nowrap">Geo ID</th>
        <th scope="col" className="gene-meta-analysis-label text-nowrap">Training</th>
        <th scope="col" className="gene-meta-analysis-label text-nowrap">Avg Age</th>
        <th scope="col" className="gene-meta-analysis-label text-nowrap">Age SD</th>
        <th scope="col" className="gene-meta-analysis-label text-nowrap">SDD</th>
      </tr>
    );
  };

  // Renders individual rows of gene meta-analysis data
  const renderMetaAnalysisTableRows = (data) => {
    const rows = data.map(item => (
      <tr key={item.sdd} className={`${item.avg_age} ${item.age_sd} ${item.sdd}`}>
        <td className="gene-meta-analysis-value text-nowrap">{item.V1}</td>
        <td className="gene-meta-analysis-value text-nowrap">{item.gse}</td>
        <td className="gene-meta-analysis-value text-nowrap">{item.training}</td>
        <td className="gene-meta-analysis-value text-nowrap">{classificationMathRound(Number(item.avg_age), 2)}</td>
        <td className="gene-meta-analysis-value text-nowrap">{classificationMathRound(Number(item.age_sd), 2)}</td>
        <td className="gene-meta-analysis-value text-nowrap">{classificationMathRound(Number(item.sdd), 2)}</td>
      </tr>
    ));

    return rows;
  };

  // Renders meta-analysis of a gene for acute muscle
  const renderMetaAnalysisData = () => {
    if (geneAanlysisDataArray && geneAanlysisDataArray.length) {
      return (
        <div className="meta-analysis-data-content d-flex align-items-start">
          <div className="col meta-analysis-data-gene-acute-muscle">
            <div className="table-responsive meta-analysis-data-table-wrapper">
              <table className="table table-sm table-striped metaAnalysisAcuteMuscleGeneTable">
                <thead className="thead-dark">
                  {renderMetaAnalysisTableHead()}
                </thead>
                <tbody>
                  {renderMetaAnalysisTableRows(geneAanlysisDataArray)}
                </tbody>
              </table>
            </div>
            <div className="note-comment d-flex align-items-center text-secondary">
              <span className="material-icons">info</span>
              <span>A cohort can have more than a single data point in a time window.</span>
            </div>
          </div>
          <div className="col meta-analysis-forest-plot">
            <img src={plotMapping[gene.toUpperCase()]} alt={gene.toUpperCase()} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="human-gene-meta-analysis">
      <div className="alert alert-warning alert-dismissible fade show warning-note d-flex align-items-center" role="alert">
        <span className="material-icons">info</span>
        <span className="warning-note-text">
          The following analyses use existing published data sets. They
          do not represent the complete meta-analysis data set.
        </span>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="d-flex justify-content-center meta-analysis-content-container">
        {/* gene search */}
        <div className="card gene-search-container col-12 col-md-3">
          <div className="card-body">
            <h6 className="card-title">Select a gene:</h6>
            <div className="gene-search-content">
              <form id="metaAnalysisGeneSearchForm" name="metaAnalysisGeneSearchForm">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    placeholder="Gene symbol"
                    aria-label="Gene symbol"
                    aria-describedby="gene-search-btn"
                    onChange={(e) => { e.preventDefault(); setInputValue(e.target.value); }}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      id="gene-search-btn"
                      className="btn btn-primary"
                      onClick={(e) => { e.preventDefault(); setGene(inputValue); }}
                    >
                      <i className="material-icons">search</i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {renderGeneInfo()}
          </div>
        </div>
        {/* meta-analysis acute muscle data */}
        <div className="col meta-analysis-data-container">
          <h5>{`Meta-Analysis${geneObj && geneObj.Symbol ? ` of ${geneObj.Symbol.toUpperCase()}` : ''} for Acute Muscle`}</h5>
          {renderMetaAnalysisData()}
        </div>
      </div>
    </div>
  );
}

export default HumanGeneMetaAnalysis;
