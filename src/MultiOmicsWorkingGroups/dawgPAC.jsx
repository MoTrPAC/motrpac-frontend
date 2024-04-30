import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HtmlReportModal from './htmlReportModal';

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

function DawgPAC({ profile }) {
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
      <h5>PASS1A/1C: Acute exercise on young adult rats</h5>
      <p>
        The goal of the acute exercise study on young adult rats (designated as
        PASS1A-06) is to conduct a comprehensive analysis of the physiological
        responses following a single exercise session in 6-month-old F344 rats.
        The primary aim was to collect a wide range of tissue samples
        post-exercise for high-quality analysis at chemical analysis sites.
      </p>
      <ul>
        <li>
          <a
            href="https://docs.google.com/document/d/1pE6SIaLxAd-gyJW34pqWyzbo6JINe2jlNTc-ONfOlqs/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Analysis Report (deadline for revisions: 4/1/2024)
          </a>
        </li>
        <li>
          <a
            href="https://drive.google.com/drive/folders/1oykRI3kffrSTfQk_G2MTt_9kjqBYxqvT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Working Google Drive folder
          </a>
        </li>
        <li>
          Source code is available in{' '}
          <a
            href="https://github.com/MoTrPAC/motrpac-rat-acute-6m"
            target="_blank"
            rel="noopener noreferrer"
          >
            this GitHub repository
          </a>
        </li>
        <li>
          Integrated R Notebooks for Omics Data Analysis (HTML format)
          <ul className="list-style mt-2">
            <li>
              Transcriptomics
              <ul className="list-style mb-2">
                <li>
                  QC + DEA:{' '}
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#html-report-modal"
                    onClick={(e) =>
                      handleClickReport(
                        'transcriptomics/pass1ac-rna-seq-analysis-report.html',
                        'pass1ac-rna-seq-analysis-report.html',
                      )
                    }
                  >
                    pass1ac-rna-seq-analysis-report.html
                  </a>
                </li>
              </ul>
            </li>
            <li>
              Metabolomics
              <ul className="list-style mb-2">
                <li>
                  QC: {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#html-report-modal"
                    onClick={(e) =>
                      handleClickReport(
                        'metabolomics/metabolomics-qc.html',
                        'metabolomics-qc.html',
                      )
                    }
                  >
                    metabolomics-qc.html
                  </a>
                </li>
                <li>
                  DA: {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#html-report-modal"
                    onClick={(e) =>
                      handleClickReport(
                        'metabolomics/metabolomics-da.html',
                        'metabolomics-da.html',
                      )
                    }
                  >
                    metabolomics-da.html
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="list-style mt-2">
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
                          onClick={(e) =>
                            handleClickReport(
                              `proteomics/1a1c-independent-analyses/${report}`,
                              report,
                            )
                          }
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
                          onClick={(e) =>
                            handleClickReport(`proteomics/da/${report}`, report)
                          }
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
                          onClick={(e) =>
                            handleClickReport(
                              `proteomics/qc-norm/${report}`,
                              report,
                            )
                          }
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

DawgPAC.defaultProps = {
  profile: {},
};

export default DawgPAC;
