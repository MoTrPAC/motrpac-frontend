import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';
import ToggleShowHide from './components/toggleShowHide';

import '@styles/mainStudyPage.scss';

const imgSourceUrl = 'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/images/figures/';

function ProjectOverview() {
  const [showSummary, setShowSummary] = useState(true);
  const [showExpDesign, setShowExpDesign] = useState(true);
  const [showTissueProfiling, setShowTissueProfiling] = useState(true);

  // Event handlers for show/hide sectional content
  const toggleShowSummary = (e) => {
    e.preventDefault();
    setShowSummary(!showSummary);
  };

  const toggleShowExpDesign = (e) => {
    e.preventDefault();
    setShowExpDesign(!showExpDesign);
  };

  const toggleShowTissueProfiling = (e) => {
    e.preventDefault();
    setShowTissueProfiling(!showTissueProfiling);
  };

  return (
    <div className="mainStudyPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Project Overview - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="MoTrPAC Project Overview" />
      <div className="main-study-container">
        <div className="main-study-content-container project-overview mt-5">
          <div className="d-flex align-items-center">
            <h3>Summary of MoTrPAC Studies</h3>
            <ToggleShowHide
              icon={showSummary ? 'expand_less' : 'expand_more'}
              toggleState={(e) => toggleShowSummary(e)}
              toggleTarget="project-overview-study-table"
            />
          </div>
          <p>
            The MoTrPAC study is divided into two main parts - animal (rats) and
            human, with multiple phases or interventions in each of them.
            Preclinical animal study sites conduct the endurance exercise and
            training intervention in rats, while Clinical study sites conduct
            the human endurance and resistance training interventions.
          </p>
          <div
            className="table-responsive collapse show"
            id="project-overview-study-table"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">
                    <h4>Animals (Rats)</h4>
                    <div className="subhead">
                      Preclinical animal study sites
                    </div>
                    <div className="d-flex align-items-center mt-1">
                      <span className="material-icons mr-1">
                        pest_control_rodent
                      </span>
                      <ExternalLink
                        to="https://motrpac.org/actDocumentDownload.cfm?docGUID=A31CDD1F-8A59-41D9-BABA-125B37A39BF5"
                        label="Animal Protocol"
                      />
                    </div>
                  </th>
                  <th scope="col">
                    <h4>Humans</h4>
                    <div className="subhead">Clinical study sites</div>
                    <div className="d-flex align-items-center mt-1">
                      <span className="material-icons mr-1">person</span>
                      <ExternalLink
                        to="https://motrpac.org/actDocumentDownload.cfm?docGUID=8120CEC8-5761-4C74-9EB3-4544EEC99FA4"
                        label="Adult Protocol"
                      />
                      <span className="material-icons mr-1 ml-3">person</span>
                      <ExternalLink
                        to="https://motrpac.org/actDocumentDownload.cfm?docGUID=67F818DF-22CC-4C56-88F4-B07FDA8BA6EE"
                        label="Pediatric Protocol"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Young Adults (6 month old)</strong>
                    <ul>
                      <li>Acute exercise</li>
                      <li>
                        <span className="intervention-title">
                          <a
                            className="anchorjs-link"
                            aria-label="Anchor"
                            href="#endurance-training"
                          >
                            Endurance training
                          </a>
                        </span>
                      </li>
                      <li>Controls</li>
                    </ul>
                    <strong>Middle-aged Adults (18 month old)</strong>
                    <ul>
                      <li>Acute exercise</li>
                      <li>Endurance training</li>
                      <li>Controls</li>
                    </ul>
                  </td>
                  <td>
                    <strong>Pediatrics</strong>
                    <ul>
                      <li>Endurance training</li>
                      <li>Acute exercise</li>
                      <li>Control</li>
                    </ul>
                    <strong>Sedentary Adults</strong>
                    <ul>
                      <li>
                        <span className="intervention-title">
                          <a
                            className="anchorjs-link"
                            aria-label="Anchor"
                            href="#acute-exercise"
                          >
                            Acute endurance exercise
                          </a>
                        </span>
                      </li>
                      <li>
                        <span className="intervention-title">
                          <a
                            className="anchorjs-link"
                            aria-label="Anchor"
                            href="#acute-exercise"
                          >
                            Acute resistance exercise
                          </a>
                        </span>
                      </li>
                      <li>Endurance training</li>
                      <li>Resistance training</li>
                      <li>Control</li>
                    </ul>
                    <strong>Highly Active Adults</strong>
                    <ul>
                      <li>Acute endurance exercise</li>
                      <li>Acute resistance exercise</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="main-study-content-container acute-exercise mt-5"
          id="acute-exercise"
        >
          <h3>Acute Exercise Response in Sedentary Adults (Pre-Suspension)</h3>
          <h6>
            Species:
            {' '}
            <span className="font-italic">Human</span>
          </h6>
          <p>
            The human <b>pre-COVID pre-suspension</b> data include an adult sedentary cohort whose multi-omics data are
            permitted for analysis under DSMB constraints. The analysis collection focuses on the acute response to a
            bout of exercise by comparing timepoints relative to pre-exercise baseline and comparing changes in exercise
            groups (endurance [EE], resistance [RE]) to matched changes in controls (CON) (&quot;difference in
            changes&quot;). Below is a visual overview of the study and the available data. See release notes and 
            publication for details.
          </p>
          <p>
            In brief, previously sedentary individuals were randomly assigned to an endurance exercise, resistance
            exercise, or a non-exercising control group. The participant group was diverse in age, fitness, and genetic
            background, with more females than males. The non-exercising control group was critical to separate the
            molecular effects of exercise from other factors like fasting, circadian rhythms, or the sampling process itself.
          </p>
          <p>
            Before the main experiment, all participants underwent baseline health and fitness testing. Those in the
            exercise groups also completed familiarization sessions to practice the workouts.
          </p>
          <p>
            On the main test day, participants arrived after an overnight fast and then completed their assigned exercise
            or rest period. Biological samples were collected from blood, skeletal muscle, and adipose (fat) tissue at
            multiple timepoints before, during, and after the intervention. All participants provided a baseline sample
            from each tissue before the session began.
          </p>
          <p>
            The exact number and timing of samples collected varied between individuals. This was intentionally designed
            to reduce participant burden and accommodate technical limitations of different lab tests.
          </p>
          <div className="main-study-content-container mt-5">
            <div
              className="study-figure border collapse show"
              id="project-overview-acute-exercise-figure"
            >
              <img
                src={`${imgSourceUrl}motrpac-human-precovid-sed-adu-study-overview.png`}
                alt="Acute Exercise in Human Sedentary Adults Study Overview"
              />
            </div>
            <p className="figure-caption text-left mt-4">
              (A) Overview of the acute exercise bout. Baseline testing is completed before randomization. After
              randomization, a familiarization period for exercise is completed. Patients arrive in the morning, fasted,
              to complete their respective interventions. Created in{' '}
              <ExternalLink
                to="https://BioRender.com"
                label="https://BioRender.com"
              />
              .
            </p>
            <p className="figure-caption text-left mt-2">
              (B) Schematic of muscle, blood, and adipose biospecimen collection. No samples are collected during resistance
              exercise. Created in{' '}
              <ExternalLink
                to="https://BioRender.com"
                label="https://BioRender.com"
              />
              .
            </p>
            <p className="figure-caption text-left mt-2">
              (C) Number of samples measured in each omic category (on any assay) by tissue, exercise modality and
              timepoint. See Supplementary Figure S1 to see overlapping measurements for all participants. ATAC = Assay
              for Transposase-Accessible Chromatin
            </p>
          </div>
          <div className="main-study-content-container mt-5">
            <div className="data-download-button-container my-5 d-flex align-items-center justify-content-center">
              <Link
                className="btn btn-primary mr-3"
                to="/data-download"
                role="button"
              >
                Download Datasets
              </Link>
              <Link
                className="btn btn-primary ml-3"
                to="/search"
                role="button"
              >
                Browse Results
              </Link>
            </div>
          </div>
        </div>
        {/* PASS1B-06 Section */}
        <hr />
        <div
          className="main-study-content-container endurance-training mt-5"
          id="endurance-training"
        >
          <h3>Endurance Training in Young Adult Rats</h3>
          <h6>
            Species:
            {' '}
            <span className="font-italic">Rattus norvegicus</span>
          </h6>
          <p>
            In this intervention, we&apos;re specifically interested in the long term
            lasting adaptive training effects, independent of acute exercise
            effects, using rats as our model organism. Data from rats provides
            the opportunity to measure tens of thousands of biomolecules in many
            tissues. Rats were endurance-exercise trained on treadmills and
            tissue samples were collected at either 1, 2, 4, or 8 weeks of
            training, with a 48 hour rest or wash out period before samples were
            collected. See the
            {' '}
            <ExternalLink
              to="https://motrpac.org/actDocumentDownload.cfm?docGUID=A31CDD1F-8A59-41D9-BABA-125B37A39BF5"
              label="animal protocol"
            />
            {' '}
            to learn more.
          </p>
          <div className="main-study-content-container mt-5">
            <div className="d-flex align-items-center sub-section-title">
              <h5>Experimental Design</h5>
              <ToggleShowHide
                icon={showExpDesign ? 'expand_less' : 'expand_more'}
                toggleState={(e) => toggleShowExpDesign(e)}
                toggleTarget="project-overview-experiment-design"
              />
            </div>
            <div
              className="study-figure border collapse show"
              id="project-overview-experiment-design"
            >
              <img
                src={`${imgSourceUrl}pass1b-06-time-course.png`}
                alt="Endurance Exercise Time Course Intervention"
              />
            </div>
          </div>
          <div className="main-study-content-container mt-5">
            <div className="d-flex align-items-center sub-section-title">
              <h5>Tissues / Molecular Profiling</h5>
              <ToggleShowHide
                icon={showTissueProfiling ? 'expand_less' : 'expand_more'}
                toggleState={(e) => toggleShowTissueProfiling(e)}
                toggleTarget="project-overview-tissue-profiling"
              />
            </div>
            <div
              className="tissue-profiling-figure collapse show"
              id="project-overview-tissue-profiling"
            >
              <p>
                For each time point, we profiled the temporal transcriptome,
                proteome, metabolome, lipidome, phosphoproteome, acetylproteome,
                ubiquitylproteome, epigenome, and immunome in whole blood,
                plasma and 18 solid tissues in Rattus norvegicus over the 8
                weeks of endurance exercise training. The figure shows the
                specific molecular profiling performed on every tissue. For
                example, in liver we run all the available assays for the 4
                exercise time points and the control. For blood, however, we
                only perform transcriptomics (rna-seq).
              </p>
              <img
                src={`${imgSourceUrl}pass1b-06-molecular-profiling.svg`}
                className="mb-2"
                alt="Endurance Exercise Tissues / Molecular Profiling"
              />
            </div>
            <div className="data-download-button-container my-5 d-flex align-items-center justify-content-center">
              <Link
                className="btn btn-primary mr-3"
                to="/data-download"
                role="button"
              >
                Download Datasets
              </Link>
              <Link
                className="btn btn-primary ml-3"
                to="/search"
                role="button"
              >
                Browse Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;
