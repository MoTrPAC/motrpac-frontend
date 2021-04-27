import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ExternalLink from '../lib/ui/externalLink';

/**
 * Renders the Heritage Family Study page in unauthenticated state
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 *
 * @returns {Object} JSX representation of the Heritage Family Study page.
 */
function HeritageProteomics({ isAuthenticated, profile }) {
  if (isAuthenticated && profile.user_metadata) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="col-md-9 col-lg-10 px-4 relatedStudyPage">
      <div className="container heritage-proteomics">
        <div className="back-button mt-3">
          <Link to="/related-studies" className="d-flex align-items-center">
            <i className="material-icons">arrow_back</i>
            <span className="px-1">Back to Related Studies</span>
          </Link>
        </div>
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>
            Human plasma proteomic profiles indicative of cardiorespiratory
            fitness
          </h3>
        </div>
        <div className="main-content">
          <p>
            Maximal oxygen uptake (VO2max) is a direct measure of
            cardiorespiratory fitness and associated with long-term health
            outcomes. However, the molecular determinants of baseline
            (intrinsic) VO2max, or increases in response to exercise training
            (ΔVO2max), are largely unknown. Here, we applied an affinity-based
            proteomic platform to measure ~5,000 plasma proteins in 654
            sedentary adults from the HERITAGE Family Study before and after a
            20-week endurance exercise intervention to characterize both
            untrained- and training-induced VO2max.
          </p>
          <div className="section-title mt-4 mb-2">
            <h5 className="mt-4">HERITAGE Family Study</h5>
          </div>
          <p>
            <ExternalLink
              to="https://www.pbrc.edu/heritage/index.html"
              label="The HEalth, RIsk factors, exercise Training And GEnetics (HERITAGE) Family Study"
            />{' '}
            is a completed exercise training study that was designed to study
            the role of genotype in cardiovascular, metabolic, and hormonal
            adaptations to endurance exercise, and to quantify their responses.
            Briefly, sedentary, adult white and black family units were enrolled
            in a 20-week, graded, supervised endurance exercise training across
            4 clinical centers in the US and Canada. Detailed measures of
            anthropometrics and body composition, including body mass index,
            lean body mass, and body fat percentage, were performed. Two maximal
            cardiopulmonary exercise tests (CPETs) were performed on separate
            days, at least 48 hours apart, before and after the exercise
            training program. A total of 654 participants who completed exercise
            training and had complete CPET data were used in longitudinal
            analyses; 745 participants had baseline CPET data. Clinical traits
            included in this dataset include: age, gender, race, baseline VO2max
            (ml/min), VO2 max changes after exercise training (ml/min), BMI,
            lean body mass (kg), and body fat percentage.
          </p>
          <div className="section-title mt-4 mb-2">
            <h5 className="mt-4">Plasma Proteomics Profiling</h5>
          </div>
          <p>
            Plasma proteomics profiling was performed using a large-scale
            affinity based platform (Somalogic, Boulder CO) whose methods have
            been published. Briefly, archived plasma samples stored in -80°C
            from HERITAGE were diluted in three different concentrations (40%,
            1% and 0.05%) and incubated with a mixture of fluorescently labeled
            single-stranded DNA aptamers (~5,000 SOMAmers™). Plasma samples had
            either 0 or 1 freeze-thaw cycle prior to proteomics profiling.
            Protein-aptamer complexes were isolated from unbound or
            nonspecifically bound proteins using a two-step, streptavidin
            bead-based immobilization process. Aptamers eluted from the target
            proteins were quantified using the degree of fluorescence (relative
            fluorescence unit, RFU) on a DNA microarray chip. Samples were
            normalized to 12 hybridization control sequences within each
            microarray and across plates using the median signal for each
            dilution. These RFU values are available in the dataset.
          </p>
          <p>
            Robbins et al.{' '}
            <span className="font-weight-bold font-italic">
              Human plasma proteomic profiles indicative of cardiorespiratory
              fitness.
            </span>{' '}
            Nature Metabolomics 2021.{' '}
            <span className="font-italic">In press</span>
          </p>
          <div className="data-download-container row justify-content-start my-4">
            <div className="mx-3 d-flex align-items-center">
              <a
                download
                href="http://gcp-bucket/file-path"
                className="btn btn-outline-primary d-flex align-items-center"
                role="button"
              >
                <i className="material-icons">file_download</i>
                <span className="px-1 text-left">
                  Download HERITAGE Proteomics dataset
                </span>
              </a>
              <div className="file-download-info d-flex align-items-center ml-2">
                <i className="material-icons">insert_drive_file</i>
                <span className="ml-1">.xslx - 26.7 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HeritageProteomics.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      hasAccess: PropTypes.bool,
    }),
  }),
  isAuthenticated: PropTypes.bool,
};

HeritageProteomics.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(HeritageProteomics);
