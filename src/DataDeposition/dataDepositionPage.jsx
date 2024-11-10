import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

function DataDeposition() {
  return (
    <div className="dataDepositionPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Data Deposition at Public Repositories - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Data Deposition at Public Repositories" />
      <div className="data-deposition-content-container row mb-4">
        <div className="col-12">
          <p className="lead">
            Aside from being made available through the Data Hub portal, the MoTrPAC
            animal study data have also been submitted to a number of public
            repositories. Below is an overview of each dataset type and the public
            repositories to which the data have been submitted.
          </p>
          {/* Epigenomics and transcriptomics data deposition table */}
          <h4 className="mt-4">Epigenomics and Transcriptomics</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Data type</th>
                  <th>Accession</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SRA</td>
                  <td>Raw data</td>
                  <td>
                    <ExternalLink to="https://www.ncbi.nlm.nih.gov/bioproject/PRJNA908279" label="PRJNA908279" />
                  </td>
                </tr>
                <tr>
                  <td>GEO</td>
                  <td>
                    Processed pipeline outputs (e.g., raw counts, merged peakset, bismark
                    coverage files)
                  </td>
                  <td>
                    <ExternalLink to="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE242358" label="GSE242358" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Immunoassay data deposition table */}
          <h4 className="mt-4">Immunoassays</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Data type</th>
                  <th>Accession</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IMMPORT</td>
                  <td>Readouts, results</td>
                  <td>
                    <ExternalLink to="https://www.immport.org/shared/home" label="SDY2193" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataDeposition;
