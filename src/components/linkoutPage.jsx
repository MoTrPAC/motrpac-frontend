import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MOTRLogo from '../assets/MoTrPAC_horizontal.png';
import NIHLogo from '../assets/ExternalLogos/NIHCommonFund.png';
import ENCODELogo from '../assets/ExternalLogos/ENCODE.png';
import MWLogo from '../assets/ExternalLogos/MetabolomicsWorkbench.jpeg';
import GTExLogo from '../assets/ExternalLogos/GTEx.png';

const linkList = [
/* Currently not desired to be on this page
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
*/
  {
    name: 'Partners',
    links: [
      {
        protocol: 'https',
        url: 'Commonfund.nih.gov',
        text: 'The primary funding source for the MoTrPAC Initiative',
        image: `url(${NIHLogo})`,
        title: 'NIH Common Fund',
      },
      {
        protocol: 'https',
        url: 'ENCODEProject.org',
        text: 'ENCODE project website',
        image: `url(${ENCODELogo})`,
        title: 'ENCODE Project',
      },
      {
        protocol: 'http',
        url: 'METABOLOMICSworkbench.org',
        text: 'UCSD Metabolomics Workbench',
        image: `url(${MWLogo})`,
        title: 'Metabolomics Workbench',
      },
      {
        protocol: 'https',
        url: 'GTExPortal.org',
        text: 'The Genotype-Tissue Expression (GTEx) project',
        image: `url(${GTExLogo})`,
        title: 'GTEx',
      },
    ],
  },
];

export function LinkoutPage() {
  const links = linkList.map(category => (
    <div key={category.name} className="LinkCategory">
      <h4>{category.name}</h4>
      <div className="row">
        {
          category.links.map(link => <UsefulLink key={link.url} link={link} />)
        }
      </div>
    </div>
  ));

  return (
    <div className="container linkoutPage">
      <div className="row title">
        <div className="col">
          <h3>Useful Links</h3>
        </div>
      </div>
      <div className="row align-items-center motrLink">
        <div className="col-12 col-md-6">
          <img src={MOTRLogo} className="img-fluid" alt="MoTrPAC Logo" />
        </div>
        <div className="col MoTrLinkInfo">
          <a href="http://MoTrPAC.org">
            MoTrPAC Main Site
            &nbsp;
            <span className="oi oi-external-link" />
          </a>
          <p>
            Primary entrance point for overarching MoTrPAC study of which the Bioinformatic Datahub is a component.
          </p>
        </div>
      </div>
      <div className="externalLinks">
        {links}
      </div>
    </div>
  );
}

function UsefulLink({ link }) {
  let imgUrl = 'url("https://via.placeholder.com/200")';
  if (link.image) {
    imgUrl = link.image;
  }
  return (
    <div className="col-12 col-sm-4 col-lg-3 p-1 linkTile" style={{ backgroundImage: imgUrl }}>
      <div className="linkInfoCont">
        <a href={`${link.protocol}://www.${link.url}`} target="_new">
          {link.title}
          &nbsp;
          <span className="oi oi-external-link" />
        </a>
        <p>
          &nbsp;
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
