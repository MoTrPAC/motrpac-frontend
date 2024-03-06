import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
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

function MultiOmicsWorkingGroups() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportLabel, setSelectedReportLabel] = useState(null);

  const handleClickReport = (report, reportLabel) => {
    setSelectedReport(report);
    setSelectedReportLabel(reportLabel);
  };

  // get states from redux store
  const userProfile = useSelector((state) => state.auth.profile);

  const userType =
    userProfile.user_metadata && userProfile.user_metadata.userType;

  if (userType !== 'internal') {
    return <Redirect to="/search" />;
  }

  return (
    <div className="multiOmicsWorkingGroupsPage px-3 px-md-4 mb-3 container">
      <PageTitle title="Resources for Multi-omics Analysis Working Groups" />
      <div className="multi-omics-working-groups-container">
        <div className="multi-omics-working-groups-content-container pre-cawg mt-5">
          <h3 className="border-bottom mb-3 pb-3">
            PRE-CAWG: PRE-COVID CASS Analysis Working Group
          </h3>
          <p>
            Processed PreCAWG data are set for internal dissemination of the
            first freeze.
          </p>
          <ul>
            <li>
              Internal freeze notes for full details on the internal freeze and
              steps for onboarding to work with the PreCAWG are available{' '}
              <a
                href="https://docs.google.com/document/d/16X19ZRc768qeCTjdpxsiaIVK3UOrnTPW9-R0pQj1W5A/edit#heading=h.ve0qe6m0m7t7"
                target="_blank"
                rel="noopener noreferrer"
              >
                this Google Doc
              </a>
            </li>
            <li>
              Source code is available in{' '}
              <a
                href="https://github.com/MoTrPAC/precovid-analyses"
                target="_blank"
                rel="noopener noreferrer"
              >
                this GitHub repository
              </a>
            </li>
            <li>
              Data processing methods are available in{' '}
              <a
                href="https://drive.google.com/drive/folders/1ixx17MrzRhBiADSsGIeEAD2yfzr79HO_?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                this Google Drive folder
              </a>
            </li>
            <li>
              Raw clinical data is available in the motrpac-data-hub bucket:{' '}
              <code>gs://motrpac-data-hub/human-precovid/phenotype/raw/</code>
            </li>
          </ul>
        </div>
        <div
          className="multi-omics-working-groups-content-container dawg-pac mt-5"
          id="endurance-training"
        >
          <h3 className="border-bottom mb-3 pb-3">
            DAWG-PAC: Data Analysis Working Group
          </h3>
          <h5>PASS1A/1C: Acute exercise on young adult rats</h5>
          <p>
            The goal of the acute exercise study on young adult rats (designated
            as PASS1A-06) is to conduct a comprehensive analysis of the
            physiological responses following a single exercise session in
            6-month-old F344 rats. The primary aim was to collect a wide range
            of tissue samples post-exercise for high-quality analysis at
            chemical analysis sites.
          </p>
          <ul>
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
              Analysis HTML Reports:
              <ul className="list-style mt-2">
                <li>
                  Metabolomics
                  <ul className="list-style mt-2">
                    <li>
                      QC
                      <ul className="list-style mb-2">
                        <li>
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            href="#"
                            data-toggle="modal"
                            data-target="#html-report-modal"
                            onClick={(e) =>
                              handleClickReport(
                                'metabolomics/qc/metabolomics-qc.html',
                                'metabolomics-qc.html',
                              )
                            }
                          >
                            metabolomics-qc.html
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      DA
                      <ul className="list-style mb-2">
                        <li>Coming soon</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="list-style mt-2">
                <li>
                  Proteomics
                  <ul className="list-style mt-2">
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
                                handleClickReport(
                                  `proteomics/da/${report}`,
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
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MultiOmicsWorkingGroups;
