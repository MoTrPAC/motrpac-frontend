import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const linkList = [
  {
    name: 'Source Code',
    links: [
      {
        protocol: 'https',
        url: 'Github.com/AshleyLab/motrpac-frontend',
        text: 'Github Repository for code creating this sites front end',
      },
      {
        protocol: 'https',
        url: 'Github.com/AshleyLab/motrpac_metaanalysis',
        text: 'Github Repository for code used in meta-analysis',
      },
    ],
  },
  {
    name: 'Partners',
    links: [
      {
        protocol: 'https',
        url: 'Commonfund.nih.gov',
        text: 'The primary funding source for the MoTrPAC Initiative',
      },
      {
        protocol: 'https',
        url: 'ENCODEdcc.org',
        text: 'ENCODE project website',
      },
      {
        protocol: 'http',
        url: 'METABOLOMICSworkbench.org',
        text: 'UCSD Metabolomics Workbench',
      },
      {
        protocol: 'https',
        url: 'GTExPortal.org',
        text: 'The Genotype-Tissue Expression (GTEx) project',
      },
    ],
  },
];

export function LinkoutPage() {
  const links = linkList.map(category => (
    <div key={category.name} className="LinkCategory">
      <h4>{category.name}</h4>
      {
        category.links.map(link => <UsefulLink key={link.url} link={link} />)
      }
    </div>
  ));

  return (
    <div className="container linkoutPage">
      <div className="row title">
        <div className="col">
          <h3>Useful Links</h3>
        </div>
      </div>
      <UsefulLink link={{ url: 'MoTrPAC.org', text: 'Main entrance point for overview of the entire MoTrPAC project', protocol: 'https' }} />
      {links}
    </div>
  );
}

function UsefulLink({ link }) {
  return (
    <div className="row linkRow">
      <div className="col-5">
        <a href={`${link.protocol}://www.${link.url}`} target="_new">{link.url}</a>
      </div>
      <div className="col">
        <p>
          {link.text}
        </p>
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

export default connect()(LinkoutPage);
