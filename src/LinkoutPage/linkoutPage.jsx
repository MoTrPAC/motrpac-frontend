import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from '../lib/ui/pageTitle';
import MOTRLogo from '../assets/MoTrPAC_horizontal.png';
import metaAnalysisGeneIcon from '../assets/analysisIcons/MetaAnalysisGene.svg';
import NIHLogo from '../assets/ExternalLogos/NIHCommonFund.png';
import ENCODELogo from '../assets/ExternalLogos/ENCODE.png';
import MWLogo from '../assets/ExternalLogos/MetabolomicsWorkbench.jpeg';
import GTExLogo from '../assets/ExternalLogos/GTEx.png';
import CFDELogo from '../assets/ExternalLogos/CFDE.png';
import OmicsPipelinesImage from '../assets/ExternalLogos/omicspipelines_dashboard.png';

const featured = [
  {
    name: 'Featured',
    links: [
      {
        protocol: 'https',
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
      {
        protocol: 'https',
        url: 'omicspipelines.org',
        text: 'OmicsPipelines is a user-friendly set of applications built by the MoTRPAC Bioinformatics Center, designed to run proteomics and genomics data analysis pipelines in the cloud, requiring minimal knowledge of cloud computing. It features two main components: an installer that sets up the necessary infrastructure on selected cloud platforms and a dashboard that facilitates the creation, execution, and monitoring of various scientific workflows, promoting collaboration through multi-user access and extensive support resources.',
        image: OmicsPipelinesImage,
        title: 'OmicsPipelines',
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
        url: 'www.nih-cfde.org',
        text: 'Common Fund Data Ecosystem',
        image: CFDELogo,
        title: 'CFDE',
      },
      {
        protocol: 'https',
        url: 'metabolomicsworkbench.org',
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
      {
        protocol: 'https',
        url: 'ENCODEProject.org',
        text: 'ENCODE project website',
        image: ENCODELogo,
        title: 'ENCODE Project',
      },
    ],
  },
];

/**
 * Renders the External Links page in both
 * unauthenticated and authenticated states.
 *
 * @returns {Object} JSX representation of the External Links page.
 */
function LinkoutPage() {
  // Render featured links
  const featuredLinks = featured.map((item) => (
    <div key={item.name} className="featured-link">
      <div className="row row-cols-1 row-cols-md-2">
        {item.links.map((link) => (
          <div key={link.url} className="col mb-4 mt-2 py-3">
            <div className="card">
              <div
                className="card-img-top"
                style={{ backgroundImage: `url("${link.image}")` }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  <a href={`${link.protocol}://${link.url}`} target="_new">
                    {link.title}
                    &nbsp;
                    <span className="oi oi-external-link" />
                  </a>
                </h5>
                <p className="card-text">{link.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ));

  // Render partner links
  const partnerLinks = partners.map((partner) => (
    <div key={partner.name} className="partner-link">
      <h3>{partner.name}</h3>
      <div className="row row-cols-1 row-cols-md-4">
        {partner.links.map((link) => (
          <UsefulLink key={link.url} link={link} />
        ))}
      </div>
    </div>
  ));

  return (
    <div className="linkoutPage px-3 px-md-4 mb-3 container">
      <div>
        <PageTitle title="Useful Links" />
        <div className="externalLinks">{featuredLinks}</div>
        <div className="externalLinks">{partnerLinks}</div>
      </div>
    </div>
  );
}

function UsefulLink({ link }) {
  return (
    <div className="col mb-4">
      <div className="card h-100 shadow-sm">
        <div
          className="card-img-top"
          style={{ backgroundImage: `url("${link.image}")` }}
        />
        <div className="card-body">
          <h5 className="card-title">
            <a href={`${link.protocol}://www.${link.url}`} target="_new">
              {link.title}
              &nbsp;
              <span className="oi oi-external-link" />
            </a>
          </h5>
          <p className="card-text">{link.text}</p>
        </div>
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

export default LinkoutPage;
