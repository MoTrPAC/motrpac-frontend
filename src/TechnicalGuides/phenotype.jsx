import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';

import '@styles/technicalGuides.scss';

const imgSourceUrl = 'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/images/figures/';

/**
 * React component that displays the phenotype technical guide.
 *
 * @returns {React.Component} The phenotype technical guide page.
 */

function Phenotype() {
  return (
    <div className="technicalGuidesPage phenotype px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Technical Guide: Phenotypic Data - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Phenotypic Data" />
      <div className="technical-guide-content-container row mb-4">
        <div className="col-12">
          <h3 className="study-title-species-icon mr-1 d-flex align-items-center mt-4">
            <span className="material-icons study-title-species-icon mr-1">pest_control_rodent</span>
            <span>Endurance trained young adult rats study</span>
          </h3>
          <h5 className="mt-4">Summary</h5>
          <p>
            This dataset is a complete collection of measured phenotypic variables, gathered for a study on
            endurance training in 6-month-old rats. Specifically, male and female Fischer 344 rats were
            subjected to progressive treadmill endurance exercise training for 1, 2, 4, or 8 weeks, with
            tissues collected 48 hours after the last exercise bout. Sex-matched sedentary, untrained rats
            were used as controls. Whole blood, plasma, and 18 solid tissues were analyzed using epigenomics,
            transcriptomics, proteomics, metabolomics, and protein immunoassay technologies, with most assays
            performed in a subset of these tissues. Depending on the assay, between 3 and 6 replicates per
            sex per time point were analyzed. Although this phenotypic dataset includes 147 animals, a subset
            of 60 animals was selected for this MoTrPAC study (the remaining animal tissues are stored in a
            biorepository).
          </p>
          <h5 className="mt-4">Files Overview</h5>
          <p>
            This phenotypic dataset consists of two main files that work together to provide comprehensive
            information about the endurance training study: the primary phenotypic data file and its
            corresponding data dictionary.
          </p>
          <h6 className="mt-4 mb-3">
            <code className="d-flex align-items-center">
              <span className="material-icons mr-1">description</span>
              <span>Phenotypic data: motrpac_pass1b-06_pheno_viallabel_data_merged_v4.0.txt</span>
            </code>
          </h6>
          <p>
            Full collection of phenotypic variables from every biospecimen involved in the study. It
            contains multiple variables related to animal tests, registration, calculations, and specimen
            processing (as defined in the dictionary file). First, we describe the key variables to
            perform basic analyses, and then more details.
          </p>
          <p className="font-weight-bold">
            Key variables include:
          </p>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Variable</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>viallabel</td>
                  <td>
                    Vial Label ID. A unique code given to each sample vial. This ID is
                    found in all related results and metadata files, serving as a key
                    to match the quantitative results with the phenotypic data.
                  </td>
                </tr>
                <tr>
                  <td>pid</td>
                  <td>
                    Participant Identifier. Uniquely assigned to each animal subject
                    (rats in this study). Samples (“viallabel”) coming from the same animal
                    have the same PID. It is relevant when combining results from multiple
                    assays and phenotype data.
                  </td>
                </tr>
                <tr>
                  <td>registration___sex</td>
                  <td>
                    Sex of the animal. 1 = Female, 2 = Male
                  </td>
                </tr>
                <tr>
                  <td>study_group_timepoint</td>
                  <td>
                    It combines the intervention and sacrifice time codes into a specific
                    format: [study group (training|control] - [time point (1w|2w|4w|8w weeks)].
                  </td>
                </tr>
                <tr>
                  <td>specimen_processing___sampletypedescription</td>
                  <td>
                    Tissue name from which the sample was derived.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-weight-bold">
            Complete dataset structure
          </p>
          <p>
            In addition to the key variables for analysis described above, the phenotypic dataset
            contains variables organized into several broader categories:
          </p>
          <ul>
            <li>
              <i>Identifiers:</i> Unique identifiers such as pid, bid, viallabel, and labelid are used
              to link samples to individual animals and their specimen labels.
            </li>
            <li>
              <i>Animal Information:</i> Variables such as registration.d_birth, registration.sex, and
              registration.weight provide basic details about the rats, including birth date,
              sex, and weight.
            </li>
            <li>
              <i>Registration and Housing:</i> Data about the arrival, housing conditions, registration
              (registration.d_arrive, registration.cagenumber), and light conditions
              (registration.d_reverselight) are included to document the environmental conditions
              in which animals were kept.
            </li>
            <li>
              <i>Intervention and Randomization:</i> Information about intervention groups (e.g.
              control or training) is captured in variables like key.intervention, key.anirandgroup,
              and key.protocol, indicating how each rat was assigned to different treatment conditions.
            </li>
            <li>
              <i>Familiarization and Training Data:</i> Detailed records of treadmill familiarization
              (familiarization.d_treadmillbegin) and progressive endurance training are included.
              Training data cover up to 40 days, with variables for each day's treadmill speed,
              incline, and exercise time (training.dayX_treadmillspeed, training.dayX_timeontreadmill).
            </li>
            <li>
              <i>VO2 Max and NMR Testing:</i> Information from VO2 max tests and NMR body composition tests
              is included. Variables such as vo2.max.test.vo2_max and nmr.testing.nmr_fat capture
              maximum oxygen uptake, percent body fat, and other key metabolic measures.
            </li>
            <li>
              <i>Specimen Collection:</i> Specimen collection details are provided, including dates
              (specimen.collection.d_visit), times of collection (specimen.processing.t_collection),
              and types of tissues collected (specimen.processing.sampletypedescription).
            </li>
            <li>
              <i>Terminal Measures:</i> Terminal metrics, such as body weight at sacrifice and tissue weights
              (terminal.weight.bw, terminal.weight.sol), document the final physical characteristics
              of the animals after completion of the study.
            </li>
            <li>
              <i>Calculated Variables:</i> Derived variables, such as changes in body composition
              (calculated.variables.pct_body_fat_change), lactate levels, and vo2_max, provide
              insights into physiological adaptations resulting from the exercise intervention.
            </li>
            <li>
              <i>Custom Variables:</i> Variables like sacrificetime, intervention, and time_to_freeze have
              been added for simplified grouping and analysis, reflecting key time points,
              interventions, and time-to-processing of samples.
            </li>
          </ul>
          <h6 className="mt-4 mb-3">
            <code className="d-flex align-items-center">
              <span className="material-icons mr-1">description</span>
              <span>Phenotypic data dictionary: motrpac_pass1b-06_pheno_dictionary_merged_v4.0.txt</span>
            </code>
          </h6>
          <p>
            This data dictionary defines the scope and possible values of data fields present in
            the phenotypic data tables. It is intended to ensure that the phenotypic data tables
            are easily interpretable and usable for analysis.
          </p>
          <p className="font-weight-bold">
            Key variables include:
          </p>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Variable</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>form_name</td>
                  <td>
                    Groups related variables by the Case Report Form the variable originated from.
                  </td>
                </tr>
                <tr>
                  <td>field_name</td>
                  <td>
                    Name of specific data field.
                  </td>
                </tr>
                <tr>
                  <td>calculated_or_created_(1=True)</td>
                  <td>
                    Flag indicating whether the field is calculated.
                  </td>
                </tr>
                <tr>
                  <td>field_description</td>
                  <td>
                    Description of what the field represents.
                  </td>
                </tr>
                <tr>
                  <td>data_type</td>
                  <td>
                    Data type of the field (e.g.
                    {' '}
                    <code>int</code>
                    ,
                    {' '}
                    <code>varchar</code>
                    ,
                    {' '}
                    <code>datetime</code>
                    ).
                  </td>
                </tr>
                <tr>
                  <td>categorical_values</td>
                  <td>
                    Accepted values for categorical variables.
                  </td>
                </tr>
                <tr>
                  <td>categorical_definitions</td>
                  <td>
                    Definitions of categorical values.
                  </td>
                </tr>
                <tr>
                  <td>continuous_range_min</td>
                  <td>
                    Minimum value for continuous variables if applicable.
                  </td>
                </tr>
                <tr>
                  <td>continuous_range_max</td>
                  <td>
                    Maximum value for continuous variables if applicable.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h5 className="mt-4">Data Quality Notes</h5>
          <p>
            Samples from weeks 1 and 2 originating from Vena Cava tissue were excluded
            from downstream molecular analysis due to contamination issues. However,
            phenotypic data for these samples remains accessible.
          </p>
          <h5 className="mt-4">Example data linkage via vial labels and pids</h5>
          <div className="vial-label-linkage-example my-4 w-100">
            <img
              src={`${imgSourceUrl}vial_label_data_linkage_example.svg`}
              alt="Example data linkage via vial labels and pids"
            />
          </div>
          <p>
            In summary, the PHENO object provides a comprehensive overview of each animal's
            involvement in the study, including the conditions under which they were kept,
            the specific training they underwent, and the physiological changes observed as
            a result of the endurance training intervention. This dataset allows for in-depth
            analysis of the effects of physical activity at various biological levels.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Phenotype;
