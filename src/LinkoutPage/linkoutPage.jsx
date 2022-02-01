import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MOTRLogo from '../assets/MoTrPAC_horizontal.png';
import metaAnalysisGeneIcon from '../assets/analysisIcons/MetaAnalysisGene.svg';
import NIHLogo from '../assets/ExternalLogos/NIHCommonFund.png';
import ENCODELogo from '../assets/ExternalLogos/ENCODE.png';
import MWLogo from '../assets/ExternalLogos/MetabolomicsWorkbench.jpeg';
import GTExLogo from '../assets/ExternalLogos/GTEx.png';
import AuthContentContainer from '../lib/ui/authContentContainer';

const featured = [
  {
    name: 'Featured',
    links: [
      {
        protocol: 'http',
        url: 'MoTrPAC.org',
        text: 'Primary entrance point for overarching MoTrPAC study of which the Bioinformatic Datahub is a component.',
        image: MOTRLogo,
        title: 'MoTrPAC Main Site',
      },
      {
        protocol: 'https',
        url: 'extrameta.org',
        text: 'A database comprising meta-analysis results from 43 publicly available exercise transcriptome datasets from human skeletal muscle and blood.',
        image: metaAnalysisGeneIcon,
        title: 'Exercise Transcriptome Meta-analysis',
      },
    ],
  },
];

const partners = [
  {
    name: 'Partners',
    links: [
      {
        protocol: 'https',
        url: 'Commonfund.nih.gov',
        text: 'The primary funding source for the MoTrPAC Initiative',
        image: NIHLogo,
        title: 'NIH Common Fund',
      },
      {
        protocol: 'https',
        url: 'ENCODEProject.org',
        text: 'ENCODE project website',
        image: ENCODELogo,
        title: 'ENCODE Project',
      },
      {
        protocol: 'http',
        url: 'METABOLOMICSworkbench.org',
        text: 'UCSD Metabolomics Workbench',
        image: MWLogo,
        title: 'Metabolomics Workbench',
      },
      {
        protocol: 'https',
        url: 'GTExPortal.org',
        text: 'The Genotype-Tissue Expression (GTEx) project',
        image: GTExLogo,
        title: 'GTEx',
      },
    ],
  },
];

/**
 * Renders the External Links page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Boolean} expanded        Redux state for sidebar
 *
 * @returns {Object} JSX representation of the External Links page.
 */
export function LinkoutPage({ isAuthenticated, expanded }) {
  // Render featured links
  const featuredLinks = featured.map((item) => (
    <div key={item.name} className="featured-link">
      <div className="card-deck">
        {item.links.map((link) => (
          <div key={link.url} className="card mt-2 py-3">
            <div
              className="card-img-top"
              style={{ backgroundImage: `url("${link.image}")` }}
            />
            <div className="card-body">
              <h6 className="card-title">
                <a href={`${link.protocol}://${link.url}`} target="_new">
                  {link.title}
                  &nbsp;
                  <span className="oi oi-external-link" />
                </a>
              </h6>
              <p className="card-text">{link.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ));

  // Render partner links
  const partnerLinks = partners.map((partner) => (
    <div key={partner.name} className="partner-link">
      <h4>{partner.name}</h4>
      <div className="card-deck">
        {partner.links.map((link) => (
          <UsefulLink key={link.url} link={link} />
        ))}
      </div>
    </div>
  ));

  const pageContent = (
    <>
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>Useful Links</h3>
      </div>
      <div className="externalLinks">{featuredLinks}</div>
      <div className="externalLinks">{partnerLinks}</div>
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className="col-md-9 col-lg-10 px-4 linkoutPage">
        <div className="container">{pageContent}</div>
      </div>
    );
  }

  return (
    <AuthContentContainer classes="linkoutPage" expanded={expanded}>
      <div>{pageContent}</div>
    </AuthContentContainer>
  );
}

function UsefulLink({ link }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div
        className="card-img-top"
        style={{ backgroundImage: `url("${link.image}")` }}
      />
      <div className="card-body">
        <h6 className="card-title">
          <a href={`${link.protocol}://www.${link.url}`} target="_new">
            {link.title}
            &nbsp;
            <span className="oi oi-external-link" />
          </a>
        </h6>
        <p className="card-text">{link.text}</p>
      </div>
    </div>
  );
}

UsefulLink.propTypes = {
  link: PropTypes.shape({
    protocol: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

LinkoutPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  expanded: PropTypes.bool,
};

LinkoutPage.defaultProps = {
  isAuthenticated: false,
  expanded: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  expanded: state.sidebar.expanded,
});

export default connect(mapStateToProps)(LinkoutPage);
