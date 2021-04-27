import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import HeritageFamilyStudyLogo from '../assets/ExternalLogos/HeritageFamilyStudy.png';
import StanfordMedicineLogo from '../assets/ExternalLogos/StanfordMedicine.png';

const relatedStudies = [
  {
    url: '/related-studies/heritage-proteomics',
    text:
      'The HERITGAE Family Study is a multicenter project whose main goal is to study the role of the genotype in the cardiovascular and metabolic responses to aerobic exercise training and the changes brought about by regular exercise for several cardiovascular disease and diabetes risk factors.',
    image: HeritageFamilyStudyLogo,
    title: 'HERITAGE Proteomics',
    newWin: false,
  },
  {
    url: 'https://extrameta.org',
    text:
      'A database comprising meta-analysis results from 43 publicly available exercise transcriptome datasets from human skeletal muscle and blood.',
    image: StanfordMedicineLogo,
    title: 'Exercise Transcriptome Meta-analysis',
    newWin: true,
  },
];

function RelatedStudy({ isAuthenticated, profile }) {
  if (isAuthenticated && profile.user_metadata) {
    return <Redirect to="/dashboard" />;
  }

  // Render related study links
  function relatedStudyLinks() {
    return (
      <div className="card-deck">
        {relatedStudies.map((study) => (
          <RelatedStudyLink key={study.url} study={study} />
        ))}
      </div>
    );
  }

  return (
    <div className="col-md-9 col-lg-10 px-4 relatedStudyPage">
      <div className="container related-studies-main">
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Related Exercise Studies</h3>
        </div>
        <div className="main-content">{relatedStudyLinks()}</div>
      </div>
    </div>
  );
}

function RelatedStudyLink({ study }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div
        className="card-img-top"
        style={{ backgroundImage: `url("${study.image}")` }}
      />
      <div className="card-body">
        <h6 className="card-title">
          {study.newWin && (
            <a href={study.url} target="_blank" rel="noopener noreferrer">
              {study.title} <span className="oi oi-external-link" />
            </a>
          )}
          {!study.newWin && <Link to={study.url}>{study.title}</Link>}
        </h6>
        <p className="card-text">{study.text}</p>
      </div>
    </div>
  );
}

RelatedStudyLink.propTypes = {
  study: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    newWin: PropTypes.bool.isRequired,
  }).isRequired,
};

RelatedStudy.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      hasAccess: PropTypes.bool,
    }),
  }),
  isAuthenticated: PropTypes.bool,
};

RelatedStudy.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(RelatedStudy);
