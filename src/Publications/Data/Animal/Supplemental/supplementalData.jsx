import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageTitle from '../../../../lib/ui/pageTitle';

function SupplementalData() {
  return (
    <div className="supplementalDataPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>MoTrPAC Publication Supplemental Data</title>
      </Helmet>
      <PageTitle title="Supplemental Data" />
      <div className="link link-back-to-publications">
        <Link
          to="/publications"
          className="d-flex align-items-center"
        >
          <span className="material-icons">arrow_back</span>
          <span>Back to Publications</span>
        </Link>
      </div>
      <div className="supplemental-data-content-container">
        <section className="supplemental-data-by-publication-content-container mt-5">
          <h3 className="pb-3 mb-3 border-bottom">
            Endurance Training Enhances Sex-Specific Cardiac Mitochondrial Adaptations
            with Implications for Cardiovascular Disease Prevention
          </h3>
          <p className="lead">
            Below are supplementary tables associated with our research letter. These
            tables contain detailed datasets and analysis results that support our
            findings on the relationship between exercise training (ET)-associated
            molecular adaptations and cardiovascular disease (CVD)-associated features.
          </p>
          <div className="table-responsive table-of-tables">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" className="table-name">Supplementary table</th>
                  <th scope="col" className="table-description">Description</th>
                  <th scope="col" className="table-contents">Contents</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <td>
                    <a
                      href="https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/publications/data/animal/supplemental/CVD_Atlas_selected_datasets_description.csv"
                      download
                    >
                      CVD_Atlas_selected_datasets_description.csv
                    </a>
                  </td>
                  <td>
                    Provides details on the datasets from the CVD Atlas that were
                    used in the study.
                  </td>
                  <td>
                    <ul className="pl-3">
                      <li>Type of omics data</li>
                      <li>Number of features per dataset</li>
                      <li>Disease name and category (as defined in our study)</li>
                      <li>Tissue source</li>
                    </ul>
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <td>
                    <a
                      href="https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/publications/data/animal/supplemental/MoTrPAC_CVD_comparison_statistical_tests.csv"
                      download
                    >
                      MoTrPAC_CVD_comparison_statistical_tests.csv
                    </a>
                  </td>
                  <td>
                    Contains results from hypergeometric tests assessing the statistical
                    overlap between MoTrPAC ET-associated features and CVD-associated
                    features.
                  </td>
                  <td>
                    <ul className="pl-3">
                      <li>Type of omics data</li>
                      <li>Disease category</li>
                      <li>Type of test (all features, concordant, discordant)</li>
                      <li>Number of shared features between ET and CVD</li>
                      <li>P-values indicating the significance of the overlap</li>
                    </ul>
                  </td>
                </tr>
                {/* row 3 */}
                <tr>
                  <td>
                    <a
                      href="https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/publications/data/animal/supplemental/Multi_omics_biological_process_enrichment_results.csv"
                      download
                    >
                      Multi_omics_biological_process_enrichment_results.csv
                    </a>
                  </td>
                  <td>
                    Lists biological processes enriched in different omics datasets where
                    molecular features show opposite regulation between ET and CVD. This
                    includes transcriptomics, proteomics, metabolomics, epigenetic
                    modifications, and post-translational modifications.
                  </td>
                  <td>
                    <ul className="pl-3">
                      <li>Disease category</li>
                      <li>Type of omics data</li>
                      <li>Enriched biological process name</li>
                      <li>-log10(adjusted p-value)</li>
                      <li>List of gene-related features contributing to the enrichment</li>
                    </ul>
                  </td>
                </tr>
                {/* row 4 */}
                <tr>
                  <td>
                    <a
                      href="https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/publications/data/animal/supplemental/SIRT3_Acetylation_correlations.csv"
                      download
                    >
                      SIRT3_Acetylation_correlations.csv
                    </a>
                  </td>
                  <td>
                    Reports inverse correlations between SIRT3 expression and acetylation
                    marks on proteins associated with ET, particularly those enriched in
                    energy metabolism, fatty acid metabolism, and antioxidative responses.
                  </td>
                  <td>
                    <ul className="pl-3">
                      <li>Correlation coefficients</li>
                      <li>Acetylation sites</li>
                      <li>Associated protein functions</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="link link-back-to-publications mt-2 mb-3">
        <Link
          to="/publications"
          className="d-flex align-items-center"
        >
          <span className="material-icons">arrow_back</span>
          <span>Back to Publications</span>
        </Link>
      </div>
    </div>
  );
}

export default SupplementalData;
