import React from 'react';
import symbolRRBS from '../../assets/figures/symbols/rrbs.svg';
import symbolATACSeq from '../../assets/figures/symbols/atac-seq.svg';
import symbolRNASeq from '../../assets/figures/symbols/rna-seq.svg';
import symbolProtPr from '../../assets/figures/symbols/prot-pr.svg';
import symbolProtPh from '../../assets/figures/symbols/prot-ph.svg';
import symbolProtAc from '../../assets/figures/symbols/prot-ac.svg';
import symbolProtUb from '../../assets/figures/symbols/prot-ub.svg';
import symbolMetab from '../../assets/figures/symbols/metab.svg';
import symbolCytokine from '../../assets/figures/symbols/cytokine.svg';

/**
 * Render static assay legends panel
 */
function FigureAssayLegends() {
  return (
    <div className="figure-assay-legends-container mt-5 p-3 border border-dark rounded">
      <h5 className="font-weight-bold pb-1 border-bottom">Genomics</h5>
      <ul className="assay-legend-list list-unstyled">
        <li className="assay-legend-item">
          <span className="sub-list-title font-weight-bold">Epigenomics</span>
          <ul className="assay-legend-sub-list list-unstyled pl-3">
            <li className="assay-legend-item d-flex align-items-center">
              <img className="legend-symbol" src={symbolRRBS} alt="rrbs" />
              <span className="legend-label ml-1">
                DNA methylation - RRBS (METHYL)
              </span>
            </li>
            <li className="assay-legend-item d-flex align-items-center">
              <img
                className="legend-symbol"
                src={symbolATACSeq}
                alt="atac-seq"
              />
              <span className="legend-label ml-1">
                Chromatin accessibility (ATAC)
              </span>
            </li>
          </ul>
        </li>
        <li className="assay-legend-item d-flex align-items-center">
          <img className="legend-symbol" src={symbolRNASeq} alt="rna-seq" />
          <span className="legend-label ml-1">RNA-seq (TRANSCRPT, SPLICE)</span>
        </li>
      </ul>
      <h5 className="font-weight-bold pb-1 border-bottom">Proteomics</h5>
      <ul className="assay-legend-list list-unstyled">
        <li className="assay-legend-item d-flex align-items-center">
          <img className="legend-symbol" src={symbolProtPr} alt="prot-pr" />
          <span className="legend-label ml-1">
            Global protein expression (PROT)
          </span>
        </li>
        <li className="assay-legend-item">
          <span className="sub-list-title font-weight-bold">
            Post-translational modifications
          </span>
          <ul className="assay-legend-sub-list list-unstyled pl-3">
            <li className="assay-legend-item d-flex align-items-center">
              <img className="legend-symbol" src={symbolProtPh} alt="prot-ph" />
              <span className="legend-label ml-1">
                Phosphorylation (PHOSPHO)
              </span>
            </li>
            <li className="assay-legend-item d-flex align-items-center">
              <img className="legend-symbol" src={symbolProtAc} alt="prot-ac" />
              <span className="legend-label ml-1">Acetylation (ACETYL)</span>
            </li>
            <li className="assay-legend-item d-flex align-items-center">
              <img className="legend-symbol" src={symbolProtUb} alt="prot-ub" />
              <span className="legend-label ml-1">Ubiquitination (UBIQ)</span>
            </li>
          </ul>
        </li>
      </ul>
      <h5 className="font-weight-bold pb-1 border-bottom">Metabolomics</h5>
      <ul className="assay-legend-list list-unstyled">
        <li className="assay-legend-item d-flex align-items-start">
          <img className="legend-symbol mt-2" src={symbolMetab} alt="metab" />
          <span className="legend-label ml-1">
            Metabolites: named (N-METAB) and unnamed (U-METAB)
          </span>
        </li>
      </ul>
      <h5 className="font-weight-bold pb-1 border-bottom">Cytokines</h5>
      <ul className="assay-legend-list list-unstyled">
        <li className="assay-legend-item d-flex align-items-center">
          <img className="legend-symbol" src={symbolCytokine} alt="cytokine" />
          <span className="legend-label ml-1">Cytokine immunoassays</span>
        </li>
      </ul>
    </div>
  );
}

export default FigureAssayLegends;
