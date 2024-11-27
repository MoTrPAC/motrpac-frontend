import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

function DataDeposition() {
  return (
    <div className="dataDepositionPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>MoTrPAC Data Accessible at Public Repositories - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="MoTrPAC Data Accessible at Public Repositories" />
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
                  <td>
                    <ExternalLink to="https://www.ncbi.nlm.nih.gov/sra" label="SRA" />
                  </td>
                  <td>Raw data</td>
                  <td>
                    <ExternalLink to="https://www.ncbi.nlm.nih.gov/bioproject/PRJNA908279" label="PRJNA908279" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ExternalLink to="https://www.ncbi.nlm.nih.gov/geo/" label="GEO" />
                  </td>
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
                  <td>
                    <ExternalLink to="https://www.immport.org/home" label="IMMPORT" />
                  </td>
                  <td>Readouts, results</td>
                  <td>
                    <ExternalLink to="https://immport.org/shared/study/SDY2193" label="SDY2193" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Metabolomics data deposition table */}
          <h4 className="mt-4">Metabolomics (Targeted and Untargeted)</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Data type</th>
                  <th>Project</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ExternalLink to="https://www.metabolomicsworkbench.org/" label="Metabolomics Workbench" />
                  </td>
                  <td>Metabolomics raw + results files (identification and quantification)</td>
                  <td>
                    <ul className="list-unstyled">
                      <li>
                        <ExternalLink to="https://www.metabolomicsworkbench.org/data/DRCCMetadata.php?Mode=Project&ProjectID=PR001020" label="PR001020" />
                      </li>
                      <li>
                        <ExternalLink to="http://dx.doi.org/10.21228/M8V97D" label="DOI: 10.21228/M8V97D" />
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Proteomics data deposition table */}
          <h4 className="mt-4">Proteomics</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Data type</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ExternalLink to="https://massive.ucsd.edu/ProteoSAFe/static/massive.jsp" label="MassIVE" />
                  </td>
                  <td>
                    <ul className="proteomics-data-submissions">
                      <li>
                        <span>
                          Global Protein Abundance in Gastrocnemius, White Adipose, Cortex,
                          Lung, and Kidney
                        </span>
                        <span className="text-muted ml-1">(Dataset ID: MSV000092911)</span>
                      </li>
                      <li>
                        <span>
                          Protein Phosphorylation in Gastrocnemius, White Adipose Tissue,
                          Cortex, Lung, and Kidney
                        </span>
                        <span className="text-muted ml-1">(Dataset ID: MSV000092925)</span>
                      </li>
                      <li>
                        <span>
                          Global Protein Abundance in Heart and Liver
                        </span>
                        <span className="text-muted ml-1">(Dataset ID: MSV000092922)</span>
                      </li>
                      <li>
                        <span>
                          Protein Acetylation in Heart and Liver
                        </span>
                        <span className="text-muted ml-1">(Dataset ID: MSV000092924)</span>
                      </li>
                      <li>
                        <span>
                          Protein Phosphorylation in Heart and Liver
                        </span>
                        <span className="text-muted ml-1">(Dataset ID: MSV000092923)</span>
                      </li>
                      <li>
                        <span>
                          Protein Ubiquitination in Heart and Liver
                        </span>
                        <span className="text-muted ml-1">(Dataset ID: MSV000092931)</span>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ul className="list-unstyled">
                      <li>
                        <ExternalLink to="https://drive.google.com/file/d/1d7etTfATHkATuOXM3SuLV7IwrpFJlYS0/view?usp=drive_link" label="Results files" />
                      </li>
                      <li>
                        <ExternalLink to="https://docs.google.com/document/d/1Kj81cOGdDUCYos7FRwHx8bBxY6Hs7EINDJ4I7zflMOM/edit?usp=drive_link" label="Methods" />
                      </li>
                    </ul>
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
