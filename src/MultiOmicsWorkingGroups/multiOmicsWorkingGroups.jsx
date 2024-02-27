import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';

function MultiOmicsWorkingGroups() {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // get states from redux store
  const userProfile = useSelector((state) => state.auth.profile);

  const userType =
    userProfile.user_metadata && userProfile.user_metadata.userType;

  if (userType !== 'internal') {
    return <Redirect to="/search" />;
  }

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

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
              Analysis R Notebooks (coming soon):
              <div className="list-group mt-2 w-25">
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  data-toggle="modal"
                  data-target="#metab-qc-notebook"
                >
                  Metabolomics QC
                </button>
                <div
                  className="modal fade"
                  id="metab-qc-notebook"
                  tabIndex="-1"
                  aria-labelledby="metab-qc-notebook-label"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title"
                          id="metab-qc-notebook-label"
                        >
                          Metabolomics QC
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="embed-responsive embed-responsive-1by1">
                          {!iframeLoaded && (
                            <div className="bootstrap-spinner d-flex justify-content-center py-5">
                              <div
                                className="spinner-border text-secondary"
                                role="status"
                              >
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                          )}
                          <iframe
                            ref={iframeRef}
                            title="Metabolomics QC Notebook"
                            src="/static-assets/dawg-pac/metabolomics-qc-notebook.html"
                            className="embed-responsive-item"
                            allowFullScreen
                            onLoad={handleIframeLoad}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  data-toggle="modal"
                  data-target="#metab-da-notebook"
                  disabled
                >
                  Metabolomics DA
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  data-toggle="modal"
                  data-target="#transcript-qc-da-notebook"
                  disabled
                >
                  Transcriptomics QC and DA
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  data-toggle="modal"
                  data-target="#prot-qc-da-notebook"
                  disabled
                >
                  Proteomics QC and DA
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MultiOmicsWorkingGroups;