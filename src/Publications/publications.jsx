import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';
import MitoPaper from '../assets/publications/mito_paper.gif';
import LandscapePaper from '../assets/publications/landscape_paper.gif';
import GinaPaper from '../assets/publications/gina_paper.gif';
import SimonPaper from '../assets/publications/simon_paper.gif';
import VenuPaper from '../assets/publications/venu_paper.gif';
import NikPaper from '../assets/publications/nik_paper.gif';
import MarkerPaper from '../assets/publications/marker_paper.gif';

import '@styles/publications.scss';

const landscapePublications = [
  {
    url: 'https://www.nature.com/articles/s41586-023-06877-w',
    title:
      'Temporal dynamics of the multi-omic response to endurance exercise training',
    authors:
      'MoTrPAC Study Group, David Amar, Nicole R. Gay, Pierre M. Jean Beltran, Joshua N. Adkins, Jose J. Almagro Armenteros, Euan Ashley, Julian Avila-Pacheco, Dam Bae, Nasim Bararpour, Charles Burant, Clary Clish, Gary Cutter, Surendra Dasari, Courtney Dennis, Charles R. Evans, Facundo M. Fernández, David Gaul, Yongchao Ge, Robert Gerszten, Laurie J. Goodyear, Zhenxin Hou, Olga Ilkayeva, Anna A. Ivanova, David Jimenez-Morales, Maureen T. Kachman, Hasmik Keshishian, William E. Kraus, Ian R. Lanza, Jun Li, Malene E. Lindholm, Ana C. Lira, Gina M. Many, Shruti Marwaha, Michael E. Miller, Michael J. Muehlbauer, K. Sreekumaran Nair, Venugopalan D. Nair, Archana Natarajan Raja, Christopher Newgard, Eric A. Ortlund, Paul D. Piehowski, David M. Presby, Wei-Jun Qian, Jessica L. Rooney, James A. Sanford, Evan Savage, Stuart C. Sealfon, Gregory R. Smith, Kevin S. Smith, Alec Steep, Cynthia L. Stowe, Yifei Sun, Russell Tracy, Nikolai G. Vetr, Martin J. Walsh, Si Wu, Tiantian Zhang, Bingqing Zhao, Jimmy Zhen, Brent G. Albertson, Mary Anne S. Amper, Ali Tugrul Balci, Marcas Bamman, Elisabeth R. Barton, Bryan Bergman, Daniel Bessesen, Frank Booth, Brian Bouverat, Thomas W. Buford, Tiziana Caputo, Toby L. Chambers, Clarisa Chavez, Maria Chikina, Roxanne Chiu, Michael Cicha, Paul M. Coen, Dan Cooper, Elaine Cornell, Karen P. Dalton, Luis Oliveria De Sousa, Roger Farrar, Kishore Gadde, Nicole Gagne, Bret H. Goodpaster, Marina A. Gritsenko, Kristy Guevara, Fadia Haddad, Joshua R. Hansen, Melissa Harris, Trevor Hastie, Krista M. Hennig, Steven G. Hershman, Andrea Hevener, Michael F. Hirshman, Fang-Chi Hsu, Kim M. Huffman, Chia-Jui Hung, Chelsea Hutchinson-Bunch, Bailey E. Jackson, Catherine Jankowski, Christopher A. Jin, Neil M. Johannsen, Benjamin G. Ke, Wendy M. Kohrt, Kyle S. Kramer, Christiaan Leeuwenburgh, Sarah J. Lessard, Bridget Lester, Xueyun Liu, Ching-ju Lu, Nathan S. Makarewicz, Kristal M. Maner-Smith, DR Mani, Nada Marjanovic, Andrea Marshall, Sandy May, Edward Melanson, Matthew E. Monroe, Ronald J. Moore, Samuel Moore, Kerrie L. Moreau, Charles C. Mundorff, Nicolas Musi, Daniel Nachun, Michael D. Nestor, Robert L. Newton Jr., Barbara Nicklas, Pasquale Nigro, German Nudelman, Marco Pahor, Cadence Pearce, Vladislav A. Petyuk, Hanna Pincas, Scott Powers, Shlomit Radom-Aizik, Krithika Ramachandran, Megan E. Ramaker, Irene Ramos, Tuomo Rankinen, Alexander (Sasha) Raskind, Blake B. Rasmussen, Eric Ravussin, R. Scott Rector, W. Jack Rejeski, Collyn Richards, Stas Rirak, Jeremy M. Robbins, Aliza B. Rubenstein, Frederique Ruf-Zamojski, Scott Rushing, Tyler J. Sagendorf, Mihir Samdarshi, Irene E. Schauer, Robert Schwartz, Nitish Seenarine, Tanu Soni, Lauren M. Sparks, Christopher Teng, Anna Thalacker-Mercer, John Thyfault, Rob Tibshirani, Scott Trappe, Todd A. Trappe, Karan Uppal, Sindhu Vangeti, Mital Vasoya, Elena Volpi, Alexandria Vornholt, Michael P. Walkup, John Williams, Ashley Xia, Zhen Yan, Xuechen Yu, Chongzhi Zang, Elena Zaslavsky, Navid Zebarjadi, Sue C. Bodine, Steven Carr, Karyn Esser, Stephen B. Montgomery, Simon Schenk, Michael P. Snyder, Matthew T. Wheeler.',
    cite: 'Nature 629, May 1, 2024.',
    image: LandscapePaper,
  },
];

const companionPublications = [
  {
    url: 'https://www.cell.com/cell-metabolism/fulltext/S1550-4131(23)00472-2',
    title:
      'The mitochondrial multi-omic response to exercise training across tissues',
    authors:
      'Amar D, Gay NR, Jimenez-Morales D, Jean Beltran PM, Ramaker ME, Raja AN, Zhao B, Sun Y, Marwaha S, Gaul DA, Hershman SG, Ferrasse A, Xia A, Lanza I, Fernández FM, Montgomery SB, Hevener AL, Ashley EA, Walsh MJ, Sparks LM, Burant CF, Rector SR, Thyfault J, Wheeler MT, Goodpaster BH, Coen PM, Schenk S, Bodine SC, Lindholm ME and The MoTrPAC Study Group.',
    cite: 'Cell Metabolism 36, 1-19, June 4, 2024.',
    image: MitoPaper,
  },
  {
    url: 'https://doi.org/10.1038/s42255-023-00959-9',
    title:
      'Sexual dimorphism and the multi-omic response to exercise training in rat subcutaneous white adipose tissue',
    authors:
      'Gina M Many, James A Sanford, Tyler J Sagendorf, Zhenxin Hou, Pasquale Nigro, Katie L Whytock, David Amar, Tiziana Caputo, Nicole R Gay, David A Gaul, Michael F Hirshman, David Jimenez-Morales, Malene E Lindholm, Michael J Muehlbauer, Maria Vamvini, Bryan C Bergman, Facundo M Fernández, Laurie J Goodyear, Andrea L Hevener, Eric A Ortlund, Lauren M Sparks, Ashley Xia, Joshua N Adkins, Sue C Bodine, Christopher B Newgard, Simon Schenk and The MoTrPAC Study Group.',
    cite: 'Nat. Metab., 2024.',
    image: GinaPaper,
  },
  {
    url: 'https://doi.org/10.1093/function/zqae014',
    title:
      'Physiological adaptations to progressive endurance exercise training in adult and aged rats: insights from the Molecular Transducers of Physical Activity Consortium (MoTrPAC)',
    authors:
      'Simon Schenk S, Sagendorf TJ, Many GM, Lira AK, DeSousa LGO, Bae D, Cicha M, Kyle Kramer KS, Muehlbauer M, Hevener AL, Rector RS, Thyfault JP, Williams JP, Goodyear LJ, Esser KA, Newgard CB, Bodine SC, and The MoTrPAC Study Group.',
    cite: 'Function, zqae014, 2024.',
    image: SimonPaper,
  },
  {
    url: 'https://doi.org/10.1016/j.xgen.2023.100421',
    title:
      'Molecular adaptations in response to exercise training are associated with tissue-specific transcriptomic and epigenomic signatures',
    authors:
      'Nair VD, Pincas H, Smith GR, Zaslavsky E, Ge Y, Amper MAS, Vasoya M, Chikina M, Sun Y, Raja AN, Mao W, Gay NR, Esser KA, Smith KS, Zhao B, Wiel L, Singh A, Lindholm ME, Amar D, Montgomery S, Snyder MP, Walsh MJ, Sealfon CS, and The MoTrPAC Study Group.',
    cite: 'Cell Genomics, 4: 100421, 2024.',
    image: VenuPaper,
  },
  {
    url: 'https://doi.org/10.1038/s41467-024-45966-w',
    title:
      'The impact of exercise on gene regulation in association with complex trait genetics',
    authors:
      'Nikolai G Vetr, Nicole R Gay, Stephen B Montgomery, and The MoTrPAC Study Group.',
    cite: 'Nature Communications 15, no. 1, May 1, 2024.',
    image: NikPaper,
  },
  {
    url: 'https://www.cell.com/cell/fulltext/S0092-8674(20)30691-7',
    title:
      'Molecular Transducers of Physical Activity Consortium (MoTrPAC): Mapping the Dynamic Responses to Exercise',
    authors:
      'James A. Sanford, Christopher D. Nogiec, Malene E. Lindholm, Joshua N. Adkins, David Amar, Surendra Dasari, Jonelle K. Drugan, Facundo M. Fernández, Shlomit Radom-Aizik, Simon Schenk, Michael P. Snyder, Russell P. Tracy, Patrick Vanderboom, Scott Trappe, Martin J. Walsh, and the Molecular Transducers of Physical Activity Consortium.',
    cite: 'Cell 181/7, 1464-1474, June 25, 2020.',
    image: MarkerPaper,
  },
];

const publicationRelatedLinks = [
  {
    title: 'Nature collection of MoTrPAC publications',
    url: 'https://www.nature.com/collections/cfiiibcebh',
    external: true,
  },
  {
    title: 'Preprint at medRxiv',
    url: 'http://doi.org/10.1101/2024.05.15.24307328',
    external: true,
  },
  {
    title: 'Preprints at bioRxiv',
    url: 'https://connect.biorxiv.org/relate/content/218',
    external: true,
  },
  {
    title: 'Supplemental data',
    url: '/publications/data/supplemental',
    external: false,
  },
];

/**
 * Renders the Pulications page.
 *
 * @returns {object} JSX representation of the Publications component
 */
function Publications() {
  // Render list of publications
  function renderPublications(category) {
    if (category === 'landscape') {
      return (
        <div className="publication-item">
          {landscapePublications.map((pub) => (
            <LandscapePublication key={pub.url} pub={pub} />
          ))}
        </div>
      );
    }
    return (
      <div className="publication-item">
        {companionPublications.map((pub) => (
          <CompanionPublication key={pub.url} pub={pub} />
        ))}
      </div>
    );
  }

  // Render list of external links at the top of the page
  function renderExternalLinks() {
    return (
      <div className="external-links-content-container mt-4 mb-2 py-2 border-top border-bottom d-flex align-items-center">
        {publicationRelatedLinks.map((link) => (
          <div className="link-item" key={link.title}>
            {link.external ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="preprint-link d-flex align-items-center justify-content-center"
              >
                <span>{link.title}</span>
                <span className="material-icons ml-1">open_in_new</span>
              </a>
            ) : (
              <Link to={link.url} className="preprint-link">
                <span>{link.title}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="publicationsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Publications - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Publications" />
      {renderExternalLinks()}
      <div className="publications-content-container mb-5">
        <div className="lead w-100">{renderPublications('landscape')}</div>
      </div>
      <div className="publications-content-container mb-5">
        <div className="lead w-100">{renderPublications('companion')}</div>
      </div>
    </div>
  );
}

// Landscape publication component
function LandscapePublication({ pub }) {
  const [showAllAuthors, setShowAllAuthors] = React.useState(false);
  const truncateLength = 623;
  const truncatedAuthors = !showAllAuthors
    ? `${pub.authors.substring(0, truncateLength)}...`
    : pub.authors;

  return (
    <div className="pub-item-content landscape-paper container mt-4 px-5 py-4">
      <div className="highlight-header row mb-2">
        <h2 className="display-4">Highlights</h2>
      </div>
      <div className="row">
        <div className="pub-image col-12 col-md-4">
          <a href={pub.url} target="_blank" rel="noopener noreferrer">
            <img src={pub.image} alt="Publication" />
          </a>
        </div>
        <div className="pub-title-authors-container col-12 col-md-8">
          <h3 className="pub-title ml-3">
            {pub.title}
          </h3>
          <p className="authors-cite ml-3 mb-1">
            <span className="pub-authors">
              {truncatedAuthors}
            </span>
          </p>
          <p className="authors-cite ml-3">
            <span className="pub-cite font-italic ml-1">{pub.cite}</span>
            <span className="fulltext-link ml-1">
              <ExternalLink to={pub.url} label="Full text" />
            </span>
            <span className="ml-3">
              <a
                href="#"
                onClick={() => setShowAllAuthors(!showAllAuthors)}
                className="show-authors-control">
                {showAllAuthors ? 'Show less authors' : 'Show all authors'}
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Companion publication component
function CompanionPublication({ pub }) {
  return (
    <div className="pub-item-content mt-4 px-3 pb-2 border-bottom">
      <div className="row">
        <div className="pub-image col-12 col-md-4">
          <a href={pub.url} target="_blank" rel="noopener noreferrer">
            <img src={pub.image} alt="Publication" />
          </a>
        </div>
        <div className="pub-title-authors-container col-12 col-md-8">
          <h3 className="pub-title ml-3">
            {pub.title}
          </h3>
          <p className="authors-cite ml-3">
            <span className="pub-authors">{pub.authors}</span>
            <span className="pub-cite font-italic ml-1">{pub.cite}</span>
            <span className="fulltext-link ml-1">
              <ExternalLink to={pub.url} label="Full text" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Publications;
