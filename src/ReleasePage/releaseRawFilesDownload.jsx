import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from '../lib/ui/externalLink';

function ReleaseRawFilesDownload({ releaseVersion, files }) {
  if (releaseVersion.match(/1.0|1.1|1.2|1.2.1/g)) {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <p className="card-text">
            Due to the large sizes of raw data files, we recommend users
            who wish to download raw data files using the
            {' '}
            <ExternalLink to="https://cloud.google.com/storage/docs/quickstart-gsutil" label="gsutil command" />
            . Below are example commands for downloading raw data files of different omics.
          </p>
          <p className="card-text">
            Raw data files of genomics, epigenomics and transcriptomic:
            <code>{`gsutil -m cp -r gs://${files.get.bucket_name}/* .`}</code>
          </p>
          <p className="card-text">
            Raw data files of metabolomics:
            <code>{`gsutil -m cp -r gs://${files.metabolomics.bucket_name}/* .`}</code>
          </p>
          <p className="card-text">
            Raw data files of proteomics:
            <code>{`gsutil -m cp -r gs://${files.proteomics.bucket_name}/* .`}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <p className="card-text">
          Due to the large sizes of raw data files, we recommend users
          who wish to download raw data files using the
          {' '}
          <ExternalLink to="https://cloud.google.com/storage/docs/quickstart-gsutil" label="gsutil command" />
          . Below are example commands for downloading raw data files of different omics.
        </p>
        <div className="additional-download-table-container">
          <h6>Phase: PASS1A 6-month</h6>
          <table className="table table-sm additional-download-table">
            <tbody>
              <tr>
                <td>Transcriptomics</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.transcriptomics.bucket_name}/pass1a-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Epigenomics</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.epigenomics.bucket_name}/pass1a-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Metabolomics-targeted</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.metabolomics_targeted.bucket_name}/pass1a-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Metabolomics-untargeted</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.metabolomics_untargeted.bucket_name}/pass1a-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Proteomics</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.proteomics.bucket_name}/pass1a-06/* .`}</code>
                </td>
              </tr>
            </tbody>
          </table>
          <h6>Phase: PASS1B 6-month</h6>
          <table className="table table-sm additional-download-table">
            <tbody>
              <tr>
                <td>Transcriptomics</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.transcriptomics.bucket_name}/pass1b-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Epigenomics</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.epigenomics.bucket_name}/pass1b-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Metabolomics-targeted</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.metabolomics_targeted.bucket_name}/pass1b-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Metabolomics-untargeted</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.metabolomics_untargeted.bucket_name}/pass1b-06/* .`}</code>
                </td>
              </tr>
              <tr>
                <td>Proteomics</td>
                <td>
                  <code>{`gsutil -m cp -r gs://${files.proteomics.bucket_name}/pass1b-06/* .`}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

ReleaseRawFilesDownload.propTypes = {
  releaseVersion: PropTypes.string.isRequired,
  files: PropTypes.shape({
    get: PropTypes.shape({ bucket_name: PropTypes.string }),
    transcriptomics: PropTypes.shape({ bucket_name: PropTypes.string }),
    epigenomics: PropTypes.shape({ bucket_name: PropTypes.string }),
    metabolomics: PropTypes.shape({ bucket_name: PropTypes.string }),
    metabolomics_targeted: PropTypes.shape({ bucket_name: PropTypes.string }),
    metabolomics_untargeted: PropTypes.shape({ bucket_name: PropTypes.string }),
    proteomics: PropTypes.shape({ bucket_name: PropTypes.string }),
  }).isRequired,
};

export default ReleaseRawFilesDownload;
