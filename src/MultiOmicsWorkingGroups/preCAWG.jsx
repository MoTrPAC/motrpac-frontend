import React from 'react';
import { Link } from 'react-router-dom';
import IconSet from '../lib/iconSet';

function PreCAWG() {
  return (
    <div className="multi-omics-working-groups-content-container pre-cawg mt-4">
      <h3 className="mb-3 pb-3">PRE-CAWG: PRE-COVID Analysis Working Group</h3>
      <h5 className="mb-2">MoTrPAC Data Package: human-precovid-sed-adu</h5>
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
                  <a
                    href="https://console.cloud.google.com/storage/browser/motrpac-data-hub?project=motrpac-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gs://motrpac-data-hub/analysis
                  </a>
                </p>
                <p>
                  <span className="font-weight-bold">Raw clinical data:</span>
                  <br />
                  <a
                    href="https://console.cloud.google.com/storage/browser/motrpac-data-hub/human-precovid/phenotype/human-precovid-sed-adu/raw?project=motrpac-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gs://motrpac-data-hub/human-precovid/phenotype/human-precovid-sed-adu/raw/
                  </a>
                </p>
              </td>
              <td className="p-3">
                <img src={IconSet.GitHub} className="my-3" alt="Code" />
                <p>
                  <span className="font-weight-bold">
                    Analysis collaboration:
                  </span>
                  <br />
                  <a
                    href="https://github.com/MoTrPAC/precovid-analyses"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/MoTrPAC/precovid-analyses
                  </a>
                </p>
                <p>
                  <span className="font-weight-bold">Data access:</span>
                  <br />
                  <a
                    href="https://github.com/MoTrPAC/MotrpacHumanPreSuspension"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/MoTrPAC/MotrpacHumanPreSuspension
                  </a>
                </p>
              </td>
              <td className="p-3">
                <img src={IconSet.GoogleDrive} className="my-3" alt="Methods" />
                <p>
                  <a
                    href="https://drive.google.com/drive/u/0/folders/1ixx17MrzRhBiADSsGIeEAD2yfzr79HO_"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MoTrPAC MAWG Teamdrive &gt; Pre-COVID &gt; Writing Methods
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h5 className="mt-3 mb-2">2024APR01 Freeze 1.1 Release Notes</h5>
      <table className="table table-bordered release-notes-table">
        <tbody>
          <tr>
            <td className="p-3">
              <dl>
                <dt>Data package nickname:</dt>
                <dd>human-precovid-sed-adu</dd>
                <dt>Type:</dt>
                <dd>Freeze</dd>
                <dt>Distribution date:</dt>
                <dd>04/01/2024 (Release)</dd>
                <dt>Organism:</dt>
                <dd>Human</dd>
                <dt>Internal Batch:</dt>
                <dd>Precovid</dd>
                <dt>Baseline activity level:</dt>
                <dd>Sedentary</dd>
              </dl>
            </td>
            <td className="p-3">
              <dl>
                <dt>Age:</dt>
                <dd>Adults</dd>
                <dt>Modality:</dt>
                <dd>resistance and endurance</dd>
                <dt>Exercise duration:</dt>
                <dd>acute and chronic</dd>
                <dt>Freeze version:</dt>
                <dd>1.1</dd>
                <dt>DMAQC CRF Version:</dt>
                <dd>1.06</dd>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
      <h5 className="mt-4 mb-2">Data Access</h5>
      <h6>Programmatic Access via Google Cloud</h6>
      <p>
        With this release, internal data access is preferred via the beta
        version of a custom R package created by Christopher Jin called{' '}
        <a
          href="https://github.com/MoTrPAC/MotrpacHumanPreSuspension"
          target="_blank"
          rel="noreferrer"
        >
          MotrpacHumanPreSuspension
        </a>
        . Using this approach ensures seamless updates for any backend changes
        to the data. Please review the README associated with GitHub repo to get
        started and ask for help from Christopher Jin or Dan Katz (best contact
        via the help desk at{' '}
        <a
          href="mailto:motrpac-helpdesk@lists.stanford.edu"
          target="_blank"
          rel="noreferrer"
        >
          motrpac-helpdesk@lists.stanford.edu
        </a>
        ) if needed.
      </p>
      <p>
        As before, data can also be accessed in the following ways
        programmatically:
        <ul>
          <li>
            From the command line using the{' '}
            <a
              href="https://cloud.google.com/sdk/docs/install"
              target="_blank"
              rel="noreferrer"
            >
              Google Cloud Command Line
            </a>{' '}
            Interface
          </li>
          <li>
            From a BIC approved download function for R such as{' '}
            <code>load_adu_norm_data</code> (currently available only in the
            functions library of the precovid-analyses GitHub repo) or{' '}
            <code>MotrpacBicQC::dl_read_gcp</code> (package{' '}
            <a
              href="https://github.com/MoTrPAC/MotrpacBicQC"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            ).
          </li>
        </ul>
      </p>
      <p>All options still require Google Cloud Command Line Interface.</p>
      <h6>Download access</h6>
      <p>
        Data will be available in early April 2024 for direct download from
        <Link to="/data-download"> MoTrPAC Data Hub</Link>.
      </p>
    </div>
  );
}

export default PreCAWG;
