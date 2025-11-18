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
      <div className="bd-callout bd-callout-warning mb-4">
        <div className="mb-2">
          <b>START HERE FOR ONBOARDING →</b>{' '}
          <a href="#onboarding">
            Analysis Collaboration: Getting started step-by-step
          </a>
        </div>
        <div className="mt-2">
          <b>2024DEC20 Freeze 1.2 →</b>{' '}
          <a
            href="https://docs.google.com/document/d/1BB2r66Jv9fYYQvR_SNw6Hwo6UThJNS1RtjFYsWCGzhY/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read latest release notes
          </a>
        </div>
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
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Data Access</h5>
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
      <div>
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
      </div>
      <p>All options still require Google Cloud Command Line Interface.</p>
      <h6>Download access</h6>
      <p>
        Data will be available in early April 2024 for direct download from
        <Link to="/data-download"> MoTrPAC Data Hub</Link>.
      </p>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Data Changes</h5>
      <h6>Versioning</h6>
      <p>
        Prior file names may have ended in “v1.txt” instead of the BIC standard
        "v1.0.txt". This has been fixed. All files remain v1.0 as the underlying
        standard methodology has not changed.
      </p>
      <h6>QC-normalized data</h6>
      <p>
        Metabolomics: during the soft release, data was scaled to{' '}
        <code>mean = 0</code>, and <code>sd = 1</code>. To allow more
        flexibility for analysts, this has been undone. The new version of the
        data follows the following format example:
        <br />
        <code className="d-block py-2">
          human-precovid-sed-adu_t11-adipose_metab-t-ka_qc-norm_log2_v1.0.txt
        </code>
        which replaces:
        <code className="d-block py-2">
          human-precovid-sed-adu_t11-adipose_metab-t-ka_qc-norm_log2-scaled_v1.txt
        </code>
      </p>
      <h6>Differential analysis results</h6>
      <p>
        With the release of Freeze 1, there are now differential analysis
        results available. Data are for differences in changes during the acute
        bout, comparing the change from pre-exercise baseline at any given
        timepoint during the acute bout as compared to resting control. Results
        are adjusted for age, sex, BMI, clinical site, and technical covariates.
        Models are processed by <code>variancePartition::dream</code> to allow
        for random effects models accounting for random effects of individuals.
        Analytical details and methods are forthcoming. Note that files
        containing these results have names annotated with “dream” to indicate
        this model selection.
      </p>
      <p>
        <b>DA data location:</b>{' '}
        <code>
          gs://motrpac-data-hub/analysis/human-precovid-sed-adu/[ome]/da[ome]
        </code>{' '}
        represents one of epigenomics, proteomics, metabolomics-targeted,
        metabolomics-untargeted, or transcriptomics.
      </p>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Guidance</h5>
      <p>
        Note that methyl-capture DA and QC-normalized data continues to be in
        "beta" status. Consortium members may incorporate the data into analysis
        pipelines, but please be aware that some results may change.
      </p>
      <h5 className="mt-5 mb-2">2024FEB05 Soft Release</h5>
      <table className="table table-bordered release-notes-table">
        <tbody>
          <tr>
            <td className="p-3">
              <dl>
                <dt>Type:</dt>
                <dd>Initial freeze</dd>
                <dt>Distribution date:</dt>
                <dd>02/05/2024 (Soft Release)</dd>
                <dt>Organism:</dt>
                <dd>Human</dd>
                <dt>Internal Batch:</dt>
                <dd>Precovid</dd>
                <dt>Baseline activity level:</dt>
                <dd>Sedentary</dd>
                <dt>Age:</dt>
                <dd>Adults</dd>
              </dl>
            </td>
            <td className="p-3">
              <dl>
                <dt>Modality:</dt>
                <dd>resistance and endurance</dd>
                <dt>Exercise duration:</dt>
                <dd>acute and chronic</dd>
                <dt>Data package nickname:</dt>
                <dd>human-precovid-sed-adu</dd>
                <dt>Freeze version:</dt>
                <dd>1.0</dd>
                <dt>DMAQC CRF Version:</dt>
                <dd>1.06</dd>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Data Notes</h5>
      <ul>
        <li>
          The <b>methyl capture pipeline</b> has been developed collaboratively
          BIC and the GET, and while data and metadata have been shared, the BIC
          is in the final stages of validating the pipeline. Users can begin
          working with the qc-normalized data, and we anticipate finalizing the
          results, which might come with minor updates, in the coming weeks.
        </li>
        <li>
          <b>Individual level genomic data</b>, per the genomic data sharing
          plan, is considered high-risk data. As such, this data requires
          additional permission to access. If you would like to work with whole
          genome sequence data, please contact the BIC.
        </li>
        <li>
          The <b>curated biospecimens file</b> is intended for analysts to be a
          replacement for the EQC file. It has a many-to-one and one-to-many
          relationship as needed between labelID, BID, pid, and vialLabel,
          though any labelID-vialLabel pair should be unique. Users should be
          aware that biospecimen data in this file is pertinent to the collected
          sample, which is identified by the labelID. Some vialLabels, which go
          off to chemical analysis, are sometimes made up of multiple combined
          labelIDs. Thus, if using the biospecimens file to flag vialLabel
          samples that might not meet the user's criteria, be aware only one of
          the multiple labelIDs that are mixed into a vialLabel may violate a
          specific biospecimen criterion. No samples have been removed from the
          data package based on data from this table. Rather we have relied on
          outlier analysis as described in the methods.
        </li>
        <li>All data sets are tab-separated .txt files.</li>
        <li>
          It is highly recommended that data is downloaded from Google Cloud in
          one of two ways:
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
              ). Both options still require Google Cloud Command Line Interface.
            </li>
          </ul>
        </li>
      </ul>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Data</h5>
      <h6>Omics</h6>
      <p>
        Omics data are available in both raw and QC-normalized format. The
        QC-normalized data is preferred for analysis, as these data are the
        result of consortium consensus imputation, normalization, batch
        correction, and outlier removal decisions.{' '}
        <b>
          <i>Please note</i>
        </b>{' '}
        that in regard to raw and analyzed data “human precovid” means slightly
        different things, as the precovid phase of clinical participation and
        multi-omic measurement did include PED and HA participants, but these
        are excluded from this analytical freeze.{' '}
        <b>Any reanalysis of the raw data must exclude these participants.</b>
      </p>
      <p>
        <b>Raw results data location:</b>{' '}
        <code>gs://motrpac-data-hub/human-precovid/results/</code>
      </p>
      <p>
        <b>QC-normalized data location:</b>{' '}
        <code>
          gs://motrpac-data-hub/analysis/human-precovid-sed-adu/[ome]/qc-norm*[ome]
        </code>{' '}
        represents one of epigenomics, proteomics, metabolomics-targeted,
        metabolomics-untargeted, or transcriptomics
      </p>
      <h6>Clinical</h6>
      <p>
        Clinical data for sedentary adults are available in the complete case
        report form (CRF) data, as transferred by the DMAQC. It includes the
        Actigraph minute-level analytical data processed by DMAQC. The only BIC
        processing to the above files is redaction of PHI and de-identification.{' '}
        <b>A critical data table is the "Key" data set</b>, which includes
        critical demographics and the randomized group for each participant. In
        these files, ds indicates the data set, while dd indicates the data
        dictionary. Missing data files contain lists of missing forms and
        visits, with a reason provided where applicable, and identified by
        participant.
      </p>
      <p>
        <b>CRF data location:</b>{' '}
        <code>
          gs://motrpac-data-hub/human-precovid/phenotype/human-precovid-sed-adu/raw
        </code>
      </p>
      <p>
        <b>Key data set:</b>{' '}
        <code>
          gs://motrpac-data-hub/human-precovid/phenotype/human-precovid-sed-adu/raw/data_sets/human-precovid-sed-adu_clinical_key_ds_crf-redacted_v1.txt
        </code>
      </p>
      <div>
        The freeze also includes a set of “curated” tables, created by the BIC
        and designed to facilitate analysis. These include:
        <ol>
          <li>
            A table of vital signs and height/weight/BMI as recorded at each
            visit
          </li>
          <li>
            Baseline and follow up exercise parameters (CPET, 1RM, grip
            strength)
          </li>
          <li>
            Acute bout exercise parameters and "dose" metrics (EE and RE
            separately)
          </li>
          <li>
            A table of biospecimen-level data (primary key: labelID-vialLabel
            pairs). This table contains data about biospecimens that might
            affect multi-omic data quality. It is recommended that analysts use
            this file rather than the EQC file to map samples to participants
            and other metadata.
          </li>
          <li>
            A table of derived variables at baseline from the Actigraph
            minute-level analytical data
          </li>
        </ol>
      </div>
      <p>
        <b>Curated clinical data location:</b>{' '}
        <code>
          gs://motrpac-data-hub/human-precovid/phenotype/human-precovid-sed-adu/curated
        </code>
      </p>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Metadata</h5>
      <h6>QC reports</h6>
      <p>
        These html reports show numerous quality checks of the raw data, and any
        steps or graphic visualizations that were utilized in decision making
        for processing raw data to the QC normalized data.
      </p>
      <p>
        <b>QC report location:</b>{' '}
        <code>
          gs://motrpac-data-hub/analysis/human-precovid-sed-adu/[ome]/metadata/*qc-report*
        </code>
      </p>
      <h6>Removed samples</h6>
      <p>
        These tables show lists of samples that have been removed from
        qc-normalized tables for either quality reasons, or because they are
        outliers.
      </p>
      <p>
        <b>Removed samples location:</b>{' '}
        <code>
          gs://motrpac-data-hub/analysis/human-precovid-sed-adu/[ome]/metadata/*removed-samples*
        </code>
      </p>
      <h6>Sample metadata</h6>
      <p>
        These include sample-level metadata that are ome/assay specific. This
        does not include any biospecimen data or demographic data that is found
        elsewhere. An example would be percent missing features for a given
        sample.{' '}
        <b>
          <i>NOTE:</i>
        </b>{' '}
        it is not recommended to use these files as a source of biospecimen or
        participant metadata, though the files may include such data. Rely on
        centralized biospecimen and Key files.
      </p>
      <p>
        <b>Sample metadata location:</b>{' '}
        <code>
          gs://motrpac-data-hub/analysis/human-precovid-sed-adu/[ome]/metadata/*metadata_samples*
        </code>
      </p>
      <h6>Feature metadata</h6>
      <p>
        These tables include feature-level metadata that are ome/assay specific.
        This does not include gene mapping, which is provided from a single
        source.
      </p>
      <p>
        <b>Feature metadata location:</b>{' '}
        <code>
          gs://motrpac-data-hub/analysis/human-precovid-sed-adu/[ome]/metadata/*metadata_features*
        </code>
      </p>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Code</h5>
      <p>
        All code for generating the data and metadata above is available at:{' '}
        <a
          href="https://github.com/MoTrPAC/precovid-analyses"
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/MoTrPAC/precovid-analyses
        </a>
        . The <code>README.md</code> describes how to interact with the data
        functionally. Access can be granted by{' '}
        <a href="mailto:jzhen@stanford.edu" target="_blank" rel="noreferrer">
          jzhen@stanford.edu
        </a>{' '}
        or{' '}
        <a href="mailto:dankatz@stanford.edu" target="_blank" rel="noreferrer">
          dankatz@stanford.edu
        </a>
        . If you'd like to run or manipulate the code, please do not work from
        the main repo, instead create a branch from the main using your name.
        Use of other branches on the repo is not recommended.
      </p>
      <h5 className="mt-4 mb-2 pb-2 border-bottom">Methods</h5>
      <p>
        The methodological description of data processing for each ome is
        available on Google Drive:{' '}
        <a
          href="https://drive.google.com/drive/u/0/folders/1ixx17MrzRhBiADSsGIeEAD2yfzr79HO_"
          target="_blank"
          rel="noreferrer"
        >
          MoTrPAC MAWG Teamdrive &gt; Pre-COVID &gt; Writing Methods
        </a>
      </p>
      <h5 className="mt-4 mb-2 pb-2 border-bottom" id="onboarding">
        Analysis Collaboration: Getting started step-by-step
      </h5>
      <div>
        If you are interested in working with the PreCAWG on integrative
        analysis on these data, complete the steps below:
        <ol>
          <li>
            <strong>
              Ensure you are listed on the required IRB for your institution.
            </strong>
          </li>
          <li>
            <strong>
              Become listed as a MoTrPAC member on the main site with your
              institutional email.
            </strong>{' '}
            Reach out to{' '}
            <a href="mailto:janelu@ufl.edu" target="_blank" rel="noreferrer">
              janelu@ufl.edu
            </a>
          </li>
          <li>
            Obtain a Google Account using your institutional email address;
            Gmail accounts are not permitted. See how{' '}
            <a
              href="https://docs.google.com/document/d/1ZfUci-mUiSBj8GEU_6QdjPSWrG9nwr7oXtdixQBcid8"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            . All institutional emails are eligible to be linked to a Google
            Account.
          </li>
          <li>
            Obtain a Slack account through your institution/institutional email
            (if your institution does not use Slack, wait for the invite - see
            below).
          </li>
          <li>
            Download and install the{' '}
            <a
              href="https://cloud.google.com/sdk/docs/install"
              target="_blank"
              rel="noreferrer"
            >
              Google Command Line Tools
            </a>{' '}
            on your preferred work computer and connect them to the
            institutional Google account you created (See Google CLI
            instructions).
          </li>
          <li>
            Set up a{' '}
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub account
            </a>
            , and familiarize yourself with Git, GitHub, and GitHub Desktop. We
            recommend GitHub desktop.{' '}
            <a
              href="https://www.youtube.com/watch?v=8Dd7KRpKeaE"
              target="_blank"
              rel="noreferrer"
            >
              Here is a video tutorial
            </a>
            .
          </li>
          <li>
            Install R and RStudio and the following MoTrPAC specific packages:
            <ol className="nested-order-list">
              <li>
                <a
                  href="https://github.com/MoTrPAC/MotrpacBicQC"
                  target="_blank"
                  rel="noreferrer"
                >
                  MotrpacBicQC
                </a>{' '}
                (everyone)
              </li>
              <li>
                <a
                  href="https://github.com/MoTrPAC/MotrpacRatTraining6mo"
                  target="_blank"
                  rel="noreferrer"
                >
                  MotrpacRatTraining6mo
                </a>{' '}
                and{' '}
                <a
                  href="https://github.com/MoTrPAC/MotrpacRatTraining6moData"
                  target="_blank"
                  rel="noreferrer"
                >
                  MotrpacRatTraining6moData
                </a>{' '}
                (for chronic exercise in 6mo rats)
              </li>
              <li>
                We also recommend{' '}
                <a
                  href="https://www.tidyverse.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  tidyverse packages
                </a>{' '}
                and{' '}
                <a
                  href="https://www.bioconductor.org/install/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bioconductor
                </a>
              </li>
            </ol>
          </li>
          <li>
            Email{' '}
            <a
              href="mailto:motrpac-helpdesk@lists.stanford.edu"
              target="_blank"
              rel="noreferrer"
            >
              motrpac-helpdesk@lists.stanford.edu
            </a>
            ,{' '}
            <a
              href="mailto:davidjm@stanford.edu"
              target="_blank"
              rel="noreferrer"
            >
              davidjm@stanford.edu
            </a>
            ,{' '}
            <a
              href="mailto:dankatz@stanford.edu"
              target="_blank"
              rel="noreferrer"
            >
              dankatz@stanford.edu
            </a>
            ,{' '}
            <a
              href="mailto:jzhen@stanford.edu"
              target="_blank"
              rel="noreferrer"
            >
              jzhen@stanford.edu
            </a>{' '}
            and <b>your local site PI</b> with a written request for the
            following access permissions:
            <ol className="nested-order-list">
              <li>MoTrPAC Data Hub</li>
              <li>Slack #precovid channel</li>
              <li>
                <a
                  href="https://drive.google.com/drive/u/0/folders/0AB_YmxAD_q-bUk9PVA"
                  target="_blank"
                  rel="noreferrer"
                >
                  MoTrPAC MAWG Teamdrive
                </a>
              </li>
              <li>
                The following Google Cloud Platform Buckets:{' '}
                <code>gs://pre-cawg</code> (read and write) and{' '}
                <code>gs://motrpac-data-hub</code> (read only)
              </li>
              <li>
                <a
                  href="https://github.com/orgs/MoTrPAC/"
                  target="_blank"
                  rel="noreferrer"
                >
                  The MoTrPAC GitHub
                </a>{' '}
                with the ability to commit to{' '}
                <a
                  href="https://github.com/MoTrPAC/precovid-analyses"
                  target="_blank"
                  rel="noreferrer"
                >
                  MoTrPAC/precovid-analyses
                </a>
                (assuming you want to collaborate) and access to
                <a
                  href="https://github.com/MoTrPAC/MotrpacHumanPreSuspension"
                  target="_blank"
                  rel="noreferrer"
                >
                  MoTrPAC/MotrpacHumanPreSuspension
                </a>
              </li>
            </ol>
          </li>
          <li>
            Once this is done, you should be able to open a PowerShell (Windows)
            or Terminal (Mac) and run the command{' '}
            <code>gsutil ls gs://motrpac-data-hub</code>. If you can, that means
            your Google Cloud CLI is set up and your GCP access is working
            correctly. If this fails, but you think you have access, check that{' '}
            <code>gsutil</code> is in your PATH.
          </li>
          <li>
            Clone the following two GitHub repositories once you are granted
            access:
            <ol className="nested-order-list">
              <li>
                <a
                  href="https://github.com/MoTrPAC/precovid-analyses"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/MoTrPAC/precovid-analyses
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MoTrPAC/motrpac-bic-norm-qc"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/MoTrPAC/motrpac-bic-norm-qc
                </a>
              </li>
            </ol>
          </li>
          <li>
            Install the{' '}
            <a
              href="https://github.com/MoTrPAC/MotrpacHumanPreSuspension"
              target="_blank"
              rel="noreferrer"
            >
              MoTrPAC/MotrpacHumanPreSuspension
            </a>{' '}
            package - this package gives you programmatic access to the PreCAWG
            data. Also review the <code>README.md</code> which explains how to
            install from the local clone of the repo. This package cannot be
            installed directly from GitHub.com.
          </li>
          <li>
            Read the{' '}
            <a
              href="https://github.com/MoTrPAC/precovid-analyses"
              target="_blank"
              rel="noreferrer"
            >
              MoTrPAC/precovid-analyses
            </a>{' '}
            <code>README.md</code> - this repo is where novel analysis code must
            be stored
          </li>
          <li>
            Set up your <code>motrpac_config.json</code> configuration file as
            described in the{' '}
            <a
              href="https://github.com/MoTrPAC/precovid-analyses"
              target="_blank"
              rel="noreferrer"
            >
              MoTrPAC/precovid-analyses
            </a>{' '}
            <code>README.md</code>
          </li>
          <li>
            Open Rstudio and attempt to run{' '}
            <code>
              human-precovid-sed-adu_t07-adipose_prot-ph_metadata_qc-report_v1.Rmd
            </code>{' '}
            (after pointing to your <code>motrpac_config.json</code> file). This
            R markdown file is in the{' '}
            <a
              href="https://github.com/MoTrPAC/precovid-analyses"
              target="_blank"
              rel="noreferrer"
            >
              MoTrPAC/precovid-analyses
            </a>{' '}
            repo in the QC folder.
          </li>
          <li>
            Then ensure that{' '}
            <code>MotrpacHumanPreSuspension::load_differential_analysis</code>{' '}
            runs for you.
          </li>
          <li>If #13 and #14 are running, you are ready to go!</li>
        </ol>
      </div>
    </div>
  );
}

export default PreCAWG;
