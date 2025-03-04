import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HtmlReportModal from './htmlReportModal';
import IconSet from '../lib/iconSet';

const proteomicsReportsDA = [
  't55-gastrocnemius_prot-ph_DEA_report.html',
  't55-gastrocnemius_prot-pr_DEA_report.html',
  't58-heart_prot-ac_DEA_report.html',
  't58-heart_prot-ph_DEA_report.html',
  't58-heart_prot-pr_DEA_report.html',
  't59-kidney_prot-ph_DEA_report.html',
  't59-kidney_prot-pr_DEA_report.html',
  't66-lung_prot-ph_DEA_report.html',
  't66-lung_prot-pr_DEA_report.html',
  't68-liver_prot-ac_DEA_report.html',
  't68-liver_prot-ph_DEA_report.html',
  't68-liver_prot-pr_DEA_report.html',
  't70-white-adipose_prot-ph_DEA_report.html',
  't70-white-adipose_prot-pr_DEA_report.html',
];

const proteomicsReportsQCNorm = [
  't55-gastrocnemius_prot-ph_qc-norm_report.html',
  't55-gastrocnemius_prot-pr_qc-norm_report.html',
  't58-heart_prot-ac_qc-norm_report.html',
  't58-heart_prot-ph_qc-norm_report.html',
  't58-heart_prot-pr_qc-norm_report.html',
  't59-kidney_prot-ph_qc-norm_report.html',
  't59-kidney_prot-pr_qc-norm_report.html',
  't66-lung_prot-ph_qc-norm_report.html',
  't66-lung_prot-pr_qc-norm_report.html',
  't68-liver_prot-ac_qc-norm_report.html',
  't68-liver_prot-ph_qc-norm_report.html',
  't68-liver_prot-pr_qc-norm_report.html',
  't70-white-adipose_prot-ph_qc-norm_report.html',
  't70-white-adipose_prot-pr_qc-norm_report.html',
];

const proteomics1A1CIndependentAnalyses = [
  't55-gastrocnemius_prot-ph_1A1C-independent-analyses_report.html',
  't55-gastrocnemius_prot-pr_1A1C-independent-analyses_report.html',
  't58-heart_prot-ac_1A1C-independent-analyses_report.html',
  't58-heart_prot-ph_1A1C-independent-analyses_report.html',
  't58-heart_prot-pr_1A1C-independent-analyses_report.html',
  't59-kidney_prot-ph_1A1C-independent-analyses_report.html',
  't59-kidney_prot-pr_1A1C-independent-analyses_report.html',
  't66-lung_prot-ph_1A1C-independent-analyses_report.html',
  't66-lung_prot-pr_1A1C-independent-analyses_report.html',
  't68-liver_prot-ac_1A1C-independent-analyses_report.html',
  't68-liver_prot-ph_1A1C-independent-analyses_report.html',
  't68-liver_prot-pr_1A1C-independent-analyses_report.html',
  't70-white-adipose_prot-ph_1A1C-independent-analyses_report.html',
  't70-white-adipose_prot-pr_1A1C-independent-analyses_report.html',
];

function DawgPAC({ profile = {} }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportLabel, setSelectedReportLabel] = useState(null);

  const handleClickReport = (report, reportLabel) => {
    setSelectedReport(report);
    setSelectedReportLabel(reportLabel);
  };

  return (
    <div
      className="multi-omics-working-groups-content-container dawg-pac mt-4"
      id="endurance-training"
    >
      <h3 className="border-bottom mb-3 pb-3">
        DAWG-PAC: Data Analysis Working Group - PASS1A/1C
      </h3>
      <h5 className="mb-2">MoTrPAC Data Freeze: rat-acute-06</h5>
      <div className="table-responsive">
        <table className="table table-bordered resources-table">
          <thead className="thead-light">
            <tr>
              <th scope="col">Data and Metadata</th>
              <th scope="col">Code</th>
              <th scope="col">Methods</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">
                <img
                  src={IconSet.GoogleCloud}
                  className="my-3"
                  alt="Data and Metadata"
                />
                <p>
                  <span className="font-weight-bold">GCP bucket:</span>
                  <br />
                  <a
                    href="https://console.cloud.google.com/storage/browser/mawg-data/rat-acute-06?project=motrpac-portal&pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gs://mawg-data/rat-acute-06
                  </a>
                </p>
              </td>
              <td className="p-3">
                <img src={IconSet.GitHub} className="my-3" alt="Code" />
                <p>
                  <span className="font-weight-bold">
                    Analysis collaboration repository:
                  </span>
                  <br />
                  <a
                    href="https://github.com/MoTrPAC/motrpac-rat-acute-6m"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/MoTrPAC/motrpac-rat-acute-6m
                  </a>
                </p>
              </td>
              <td className="p-3">
                <img src={IconSet.GoogleDrive} className="my-3" alt="Methods" />
                <p>
                  <a
                    href="https://drive.google.com/drive/folders/1_DCO6a9Ug8vlfTOUi67yl6KI3H0Px1b-?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MoTrPAC MAWG Teamdrive &gt; PASS1A-1C-06 &gt; Writing Methods
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bd-callout bd-callout-warning mb-4">
        <b>2024DEC20 Soft Release →</b>
        {' '}
        <a href="https://docs.google.com/document/d/1-VphKxR9jQKFUFRjsF12YVY_pkO2oLOAHunjFc2Alxg/edit?tab=t.0#heading=h.ve0qe6m0m7t7" target="_blank" rel="noopener noreferrer">
          Read Notes
        </a>
      </div>
      <h5>PASS1A/1C: Acute exercise on young adult rats</h5>
      <p>
        The goal of the acute exercise study on young adult rats (designated as
        PASS1A-06) is to conduct a comprehensive analysis of the physiological
        responses following a single exercise session in 6-month-old F344 rats.
        The primary aim was to collect a wide range of tissue samples
        post-exercise for high-quality analysis at chemical analysis sites.
      </p>
      <h5>Resources</h5>
      <ul>
        <li>
          <a
            href="https://drive.google.com/drive/folders/1oykRI3kffrSTfQk_G2MTt_9kjqBYxqvT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Drive working folder
          </a>
        </li>
        <li>
          Source code:
          {' '}
          <a
            href="https://github.com/MoTrPAC/motrpac-rat-acute-6m"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/MoTrPAC/motrpac-rat-acute-6m
          </a>
        </li>
        <li>
          <strong>Integrated R Notebooks for Omics Data Analysis</strong>
          {' '}
          (HTML format)
          <ul className="list-style mt-2">
            <li className="mb-2">
              <strong>Phenotypes:</strong>
              {' '}
              Comprehensive analysis of key variables from the rat phenotypic data,
              including summary statistics, correlation analysis, statistical testing,
              and regression models:
              {' '}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                data-toggle="modal"
                data-target="#html-report-modal"
                onClick={(e) => handleClickReport('phenotypes/pass1ac-6-pheno-analysis.html', 'pass1ac-6-pheno-analysis.html')}
              >
                pass1ac-6-pheno-analysis.html
              </a>
            </li>
            <li>
              <strong>Transcriptomics</strong>
              <ul className="list-style mb-2">
                <li>
                  QC + DEA:
                  {' '}
                  pass1ac-6-rna-seq-analysis-report.html
                </li>
              </ul>
            </li>
            <li>
              <strong>Metabolomics</strong>
              <ul className="list-style mb-2">
                <li>
                  QC + DA:
                  {' '}
                  pass1ac-6-metabolomics-analysis-report.html
                </li>
              </ul>
            </li>
            <li>
              <strong>Proteomics</strong>
              <ul className="list-style mb-2">
                <li>
                  Coming soon
                </li>
              </ul>
            </li>
            <li>
              <strong>ATAC-seq</strong>
              <ul className="list-style mb-2">
                <li>
                  Coming soon
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <strong>Preliminary Analysis Report:</strong>
          <ul className="list-style mt-2">
            <li>
              <a
                href="https://docs.google.com/document/d/1pE6SIaLxAd-gyJW34pqWyzbo6JINe2jlNTc-ONfOlqs/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link to the report
              </a>
              {' '}
              (Google Doc)
            </li>
            <li>
              R Notebooks for Omics Data Analysis (HTML format)
              <ul className="list-style mt-2">
                <li>
                  Metabolomics
                  <ul className="list-style mb-2">
                    <li>
                      QC:
                      {' '}
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <a
                        href="#"
                        data-toggle="modal"
                        data-target="#html-report-modal"
                        onClick={(e) => handleClickReport('metabolomics/metabolomics-qc.html', 'metabolomics-qc.html')}
                      >
                        metabolomics-qc.html
                      </a>
                    </li>
                    <li>
                      DA:
                      {' '}
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <a
                        href="#"
                        data-toggle="modal"
                        data-target="#html-report-modal"
                        onClick={(e) => handleClickReport('metabolomics/metabolomics-da.html', 'metabolomics-da.html')}
                      >
                        metabolomics-da.html
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  Proteomics
                  <ul className="list-style mt-2">
                    <li>
                      1A1C-independent-analyses
                      <ul className="list-style mb-2">
                        {proteomics1A1CIndependentAnalyses.map((report) => (
                          <li key={report}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                              href="#"
                              data-toggle="modal"
                              data-target="#html-report-modal"
                              onClick={(e) => handleClickReport(`proteomics/1a1c-independent-analyses/${report}`, report)}
                            >
                              {report}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      DA
                      <ul className="list-style mb-2">
                        {proteomicsReportsDA.map((report) => (
                          <li key={report}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                              href="#"
                              data-toggle="modal"
                              data-target="#html-report-modal"
                              onClick={(e) => handleClickReport(`proteomics/da/${report}`, report)}
                            >
                              {report}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      QC-norm
                      <ul className="list-style mb-2">
                        {proteomicsReportsQCNorm.map((report) => (
                          <li key={report}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                              href="#"
                              data-toggle="modal"
                              data-target="#html-report-modal"
                              onClick={(e) => handleClickReport(`proteomics/qc-norm/${report}`, report)}
                            >
                              {report}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <HtmlReportModal
          selectedReport={selectedReport}
          selectedReportLabel={selectedReportLabel}
          profile={profile}
        />
      </ul>
    </div>
  );
}

DawgPAC.propTypes = {
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
};

export default DawgPAC;
