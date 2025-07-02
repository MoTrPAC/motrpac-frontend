import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ExternalLink from '../lib/ui/externalLink';
import PageTitle from '../lib/ui/pageTitle';

import '@styles/linkoutPage.scss';

const imgSourceUrl = 'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/images/external_resources/';

const featured = [
  {
    name: 'Featured',
    links: [
      {
        protocol: 'https',
        url: 'MoTrPAC.org',
        text: 'Primary entrance point for overarching MoTrPAC study of which the Bioinformatic Data Hub is a component.',
        image: `${imgSourceUrl}MoTrPAC_horizontal.png`,
        title: 'MoTrPAC Consortium Site',
      },
      {
        protocol: 'https',
        url: 'motrpac.org/join/volunteerHome.cfm',
        text: 'The MoTrPAC Study is recruiting volunteers to participate in the research study. More information and details available at the MoTrPAC Consortium Site.',
        image: `${imgSourceUrl}MoTrPAC_Recruitment_logo.png`,
        title: 'Volunteer',
      },
      {
        protocol: 'https',
        url: 'extrameta.org',
        text: 'A database comprising meta-analysis results from 43 publicly available exercise transcriptome datasets from human skeletal muscle and blood.',
        image: `${imgSourceUrl}MetaAnalysisGene.svg`,
        title: 'Exercise Transcriptome Meta-analysis',
      },
      {
        protocol: 'https',
        url: 'omicspipelines.org',
        text: 'OmicsPipelines is a user-friendly set of applications built by the MoTRPAC Bioinformatics Center, designed to run proteomics and genomics data analysis pipelines in the cloud, requiring minimal knowledge of cloud computing. It features two main components: an installer that sets up the necessary infrastructure on selected cloud platforms and a dashboard that facilitates the creation, execution, and monitoring of various scientific workflows, promoting collaboration through multi-user access and extensive support resources.',
        image: `${imgSourceUrl}omicspipelines_dashboard.png`,
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
        image: `${imgSourceUrl}NIHCommonFund.png`,
        title: 'NIH Common Fund',
      },
      {
        protocol: 'https',
        url: 'info.cfde.cloud',
        text: 'CFDE Information Portal',
        image: `${imgSourceUrl}CFDE_WORKBENCH.png`,
        title: 'CFDE Workbench',
      },
      {
        protocol: 'https',
        url: 'metabolomicsworkbench.org',
        text: 'UCSD Metabolomics Workbench',
        image: `${imgSourceUrl}MetabolomicsWorkbench.jpeg`,
        title: 'Metabolomics Workbench',
      },
      {
        protocol: 'https',
        url: 'GTExPortal.org',
        text: 'The Genotype-Tissue Expression (GTEx) project',
        image: `${imgSourceUrl}GTEx.png`,
        title: 'GTEx',
      },
      {
        protocol: 'https',
        url: 'ENCODEProject.org',
        text: 'ENCODE project website',
        image: `${imgSourceUrl}ENCODE.png`,
        title: 'ENCODE Project',
      },
      {
        protocol: 'https',
        url: 'humanperformance.stanford.edu',
        text: 'The Wu Tsai Human Performance Alliance at Stanford University',
        image: `${imgSourceUrl}WuTsai_Human_Performance_Alliace.jpg`,
        title: 'Wu Tsai Human Performance Alliance at Stanford',
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
                <h5 className="card-title text-center">
                  <ExternalLink
                    to={`${link.protocol}://${link.url}`}
                    label={link.title}
                  />
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
      <Helmet>
        <html lang="en" />
        <title>Useful Links - MoTrPAC Data Hub</title>
      </Helmet>
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
            <ExternalLink
              to={`${link.protocol}://${link.url}`}
              label={link.title}
            />
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
