import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
import PASS1B06TimeCourse from '../assets/figures/pass1b-06-time-course.png';
import PASS1B06Profiling from '../assets/figures/pass1b-06-molecular-profiling.png';

function MainStudy() {
  return (
    <div className="mainStudyPage px-3 px-md-4 mb-3 container">
      <PageTitle title="MoTrPAC Project Overview" />
      <div className="main-study-container">
        <div className="main-study-content-container project-overview mt-5">
          <h3>Summary of MoTrPAC Studies</h3>
          <p>
            The MoTrPAC study is divided into two main parts - animal (rats) and
            human, with multiple phases or interventions in each of them.
            Preclinical animal study sites conduct the endurance exercise and
            training intervention in rats, while Clinical study sites conduct
            the human endurance and resistance training interventions.
          </p>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">
                    <h4>Animals (Rats)</h4>
                    <div className="subhead">
                      Preclinical animal study sites
                    </div>
                  </th>
                  <th scope="col">
                    <h4>Humans</h4>
                    <div className="subhead">Clinical study sites</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Young adult (6 month old)</strong>
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
                    <strong>Middle-aged adult (18 month old)</strong>
                    <ul>
                      <li>Acute exercise</li>
                      <li>Endurance training</li>
                      <li>Controls</li>
                    </ul>
                  </td>
                  <td>
                    <strong>Pediatric</strong>
                    <ul>
                      <li>Endurance training</li>
                      <li>Acute exercise</li>
                      <li>Control</li>
                    </ul>
                    <strong>Adult</strong>
                    <ul>
                      <li>Acute endurance exercise</li>
                      <li>Acute resistance exercise</li>
                      <li>Endurance training</li>
                      <li>Resistance training</li>
                      <li>Control</li>
                    </ul>
                    <strong>Highly active adult</strong>
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
          className="main-study-content-container endurance-training mt-5"
          id="endurance-training"
        >
          <h3>Endurance Training in Young Adult Rats</h3>
          <h6>
            Species: <span className="font-italic">Rattus norvegicus</span>
          </h6>
          <p>
            In this intervention, we're specifically interested in the long term
            lasting adaptive training effects, independent of acute exercise
            effects, using rats as our model organism. Data from rats provides
            the opportunity to measure tens of thousands of biomolecules in many
            tissues. Rats were endurance-exercise trained on treadmills and
            tissue samples were collected at either 1, 2, 4, or 8 weeks of
            training, with a 48 hour rest or wash out period before samples were
            collected.
          </p>
          <div className="main-study-content-container mt-5">
            <h5>Experimental Design</h5>
            <div className="study-figure border">
              <img
                src={PASS1B06TimeCourse}
                alt="Endurance Exercise Time Course Intervention"
              />
            </div>
          </div>
          <div className="main-study-content-container mt-5">
            <h5>Tissues / Molecular Profiling</h5>
            <p>
              For each time point, We profiled the temporal transcriptome,
              proteome, metabolome, lipidome, phosphoproteome, acetylproteome,
              ubiquitylproteome, epigenome, and immunome in whole blood, plasma
              and 18 solid tissues in Rattus norvegicus over the 8 weeks of
              enduranceexercise training. The figure shows the specific
              molecular profiling performed on every tissue. For example, in
              liver we run all the available assays for the 4 exercise time
              points and the control. For blood, however, we only perform
              transcriptomics (rna-seq).
            </p>
            <img
              src={PASS1B06Profiling}
              className="mb-2"
              alt="Endurance Exercise Tissues / Molecular Profiling"
            />
            <div className="data-download-button-container my-5">
              <Link
                className="btn btn-primary"
                to="data-download"
                role="button"
              >
                Download Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainStudy;
