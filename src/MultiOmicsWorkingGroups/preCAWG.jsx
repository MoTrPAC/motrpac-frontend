import React from 'react';

function PreCAWG() {
  return (
    <div className="multi-omics-working-groups-content-container pre-cawg mt-4">
      <h3 className="border-bottom mb-3 pb-3">
        PRE-CAWG: PRE-COVID Analysis Working Group
      </h3>
      <p>
        Processed PreCAWG data are set for internal dissemination of the first
        freeze.
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
  );
}

export default PreCAWG;
