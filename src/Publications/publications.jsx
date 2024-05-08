import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

const publications = [
  {
    url: 'https://doi.org/10.1016/j.cmet.2023.12.021',
    title:
      'The mitochondrial multi-omic response to exercise training across tissues',
    authors:
      'Amar D, Gay NR, Jimenez-Morales D, Jean Beltran PM, Ramaker ME, Raja AN, Zhao B, Sun Y, Marwaha S, Gaul DA, Hershman SG, Ferrasse A, Xia A, Lanza I, Fernández FM, Montgomery SB, Hevener AL, Ashley EA, Walsh MJ, Sparks LM, Burant CF, Rector SR, Thyfault J, Wheeler MT, Goodpaster BH, Coen PM, Schenk S, Bodine SC, Lindholm ME and The MoTrPAC Study Group.',
    cite: 'Cell Metabolism 36, 1-19, June 4, 2024.',
  },
  {
    url: 'https://www.nature.com/articles/s41586-023-06877-w',
    title:
      'Temporal dynamics of the multi-omic response to endurance exercise training',
    authors:
      'MoTrPAC Study Group, David Amar, Nicole R. Gay, Pierre M. Jean Beltran, Joshua N. Adkins, Jose J. Almagro Armenteros, Euan Ashley, Julian Avila-Pacheco, Dam Bae, Nasim Bararpour, Charles Burant, Clary Clish, Gary Cutter, Surendra Dasari, Courtney Dennis, Charles R. Evans, Facundo M. Fernández, David Gaul, Yongchao Ge, Robert Gerszten, Laurie J. Goodyear, Zhenxin Hou, Olga Ilkayeva, Anna A. Ivanova, David Jimenez-Morales, Maureen T. Kachman, Hasmik Keshishian, William E. Kraus, Ian R. Lanza, Jun Li, Malene E. Lindholm, Ana C. Lira, Gina M. Many, Shruti Marwaha, Michael E. Miller, Michael J. Muehlbauer, K. Sreekumaran Nair, Venugopalan D. Nair, Archana Natarajan Raja, Christopher Newgard, Eric A. Ortlund, Paul D. Piehowski, David M. Presby, Wei-Jun Qian, Jessica L. Rooney, James A. Sanford, Evan Savage, Stuart C. Sealfon, Gregory R. Smith, Kevin S. Smith, Alec Steep, Cynthia L. Stowe, Yifei Sun, Russell Tracy, Nikolai G. Vetr, Martin J. Walsh, Si Wu, Tiantian Zhang, Bingqing Zhao, Jimmy Zhen, Brent G. Albertson, Mary Anne S. Amper, Ali Tugrul Balci, Marcas Bamman, Elisabeth R. Barton, Bryan Bergman, Daniel Bessesen, Frank Booth, Brian Bouverat, Thomas W. Buford, Tiziana Caputo, Toby L. Chambers, Clarisa Chavez, Maria Chikina, Roxanne Chiu, Michael Cicha, Paul M. Coen, Dan Cooper, Elaine Cornell, Karen P. Dalton, Luis Oliveria De Sousa, Roger Farrar, Kishore Gadde, Nicole Gagne, Bret H. Goodpaster, Marina A. Gritsenko, Kristy Guevara, Fadia Haddad, Joshua R. Hansen, Melissa Harris, Trevor Hastie, Krista M. Hennig, Steven G. Hershman, Andrea Hevener, Michael F. Hirshman, Fang-Chi Hsu, Kim M. Huffman, Chia-Jui Hung, Chelsea Hutchinson-Bunch, Bailey E. Jackson, Catherine Jankowski, Christopher A. Jin, Neil M. Johannsen, Benjamin G. Ke, Wendy M. Kohrt, Kyle S. Kramer, Christiaan Leeuwenburgh, Sarah J. Lessard, Bridget Lester, Xueyun Liu, Ching-ju Lu, Nathan S. Makarewicz, Kristal M. Maner-Smith, DR Mani, Nada Marjanovic, Andrea Marshall, Sandy May, Edward Melanson, Matthew E. Monroe, Ronald J. Moore, Samuel Moore, Kerrie L. Moreau, Charles C. Mundorff, Nicolas Musi, Daniel Nachun, Michael D. Nestor, Robert L. Newton Jr., Barbara Nicklas, Pasquale Nigro, German Nudelman, Marco Pahor, Cadence Pearce, Vladislav A. Petyuk, Hanna Pincas, Scott Powers, Shlomit Radom-Aizik, Krithika Ramachandran, Megan E. Ramaker, Irene Ramos, Tuomo Rankinen, Alexander (Sasha) Raskind, Blake B. Rasmussen, Eric Ravussin, R. Scott Rector, W. Jack Rejeski, Collyn Richards, Stas Rirak, Jeremy M. Robbins, Aliza B. Rubenstein, Frederique Ruf-Zamojski, Scott Rushing, Tyler J. Sagendorf, Mihir Samdarshi, Irene E. Schauer, Robert Schwartz, Nitish Seenarine, Tanu Soni, Lauren M. Sparks, Christopher Teng, Anna Thalacker-Mercer, John Thyfault, Rob Tibshirani, Scott Trappe, Todd A. Trappe, Karan Uppal, Sindhu Vangeti, Mital Vasoya, Elena Volpi, Alexandria Vornholt, Michael P. Walkup, John Williams, Ashley Xia, Zhen Yan, Xuechen Yu, Chongzhi Zang, Elena Zaslavsky, Navid Zebarjadi, Sue C. Bodine, Steven Carr, Karyn Esser, Stephen B. Montgomery, Simon Schenk, Michael P. Snyder, Matthew T. Wheeler.',
    cite: 'Nature 629, May 1, 2024.',
  },
  {
    url: 'https://doi.org/10.1038/s42255-023-00959-9',
    title:
      'Sexual dimorphism and the multi-omic response to exercise training in rat subcutaneous white adipose tissue',
    authors:
      'Gina M Many, James A Sanford, Tyler J Sagendorf, Zhenxin Hou, Pasquale Nigro, Katie L Whytock, David Amar, Tiziana Caputo, Nicole R Gay, David A Gaul, Michael F Hirshman, David Jimenez-Morales, Malene E Lindholm, Michael J Muehlbauer, Maria Vamvini, Bryan C Bergman, Facundo M Fernández, Laurie J Goodyear, Andrea L Hevener, Eric A Ortlund, Lauren M Sparks, Ashley Xia, Joshua N Adkins, Sue C Bodine, Christopher B Newgard, Simon Schenk and The MoTrPAC Study Group.',
    cite: 'Nat. Metab., 2024.',
  },
  {
    url: 'https://doi.org/10.1093/function/zqae014',
    title:
      'Physiological adaptations to progressive endurance exercise training in adult and aged rats: insights from the Molecular Transducers of Physical Activity Consortium (MoTrPAC)',
    authors:
      'Simon Schenk S, Sagendorf TJ, Many GM, Lira AK, DeSousa LGO, Bae D, Cicha M, Kyle Kramer KS, Muehlbauer M, Hevener AL, Rector RS, Thyfault JP, Williams JP, Goodyear LJ, Esser KA, Newgard CB, Bodine SC, and The MoTrPAC Study Group.',
    cite: 'Function, zqae014, 2024.',
  },
  {
    url: 'https://doi.org/10.1016/j.xgen.2023.100421',
    title:
      'Molecular adaptations in response to exercise training are associated with tissue-specific transcriptomic and epigenomic signatures',
    authors:
      'Nair VD, Pincas H, Smith GR, Zaslavsky E, Ge Y, Amper MAS, Vasoya M, Chikina M, Sun Y, Raja AN, Mao W, Gay NR, Esser KA, Smith KS, Zhao B, Wiel L, Singh A, Lindholm ME, Amar D, Montgomery S, Snyder MP, Walsh MJ, Sealfon CS, and The MoTrPAC Study Group.',
    cite: 'Cell Genomics, 4: 100421, 2024.',
  },
  {
    url: 'https://doi.org/10.1038/s41467-024-45966-w',
    title:
      'The impact of exercise on gene regulation in association with complex trait genetics',
    authors:
      'Nikolai G Vetr, Nicole R Gay, Stephen B Montgomery, and The MoTrPAC Study Group.',
    cite: 'Nature Communications 15, no. 1, May 1, 2024.',
  },
  {
    url: 'https://www.cell.com/cell/fulltext/S0092-8674(20)30691-7',
    title:
      'Molecular Transducers of Physical Activity Consortium (MoTrPAC): Mapping the Dynamic Responses to Exercise',
    authors:
      'James A. Sanford, Christopher D. Nogiec, Malene E. Lindholm, Joshua N. Adkins, David Amar, Surendra Dasari, Jonelle K. Drugan, Facundo M. Fernández, Shlomit Radom-Aizik, Simon Schenk, Michael P. Snyder, Russell P. Tracy, Patrick Vanderboom, Scott Trappe, Martin J. Walsh, and the Molecular Transducers of Physical Activity Consortium.',
    cite: 'Cell 181/7, 1464-1474, June 25, 2020.',
  },
];

/**
 * Renders the Pulications page.
 *
 * @returns {object} JSX representation of the Publications component
 */
function Publications() {
  // Render list of publications
  function renderPublications() {
    return (
      <div className="publication-item">
        {publications.map((pub) => (
          <Publication key={pub.url} pub={pub} />
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
      <div className="publications-content-container row mb-4">
        <div className="lead col-12">{renderPublications()}</div>
      </div>
      <div className="preprint-content-container row mb-4">
        <div className="lead col-12">
          <a
            href="https://connect.biorxiv.org/relate/content/218"
            target="_blank"
            rel="noopener noreferrer"
            className="preprint-link"
          >
            <span>See our full list of preprints at bioRxiv</span>{' '}
            <span className="oi oi-external-link" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Publication({ pub }) {
  return (
    <div className="pub-item-content mt-4 pb-2 border-bottom">
      <h3 className="pub-title">
        {pub.title} <span className="oi oi-external-link" />
      </h3>
      <p className="authors-cite">
        <span className="pub-authors">{pub.authors}</span>
        <span className="pub-cite font-italic ml-1">{pub.cite}</span>
        <span className="fulltext-link ml-1">
          <ExternalLink to={pub.url} label="Full text" />
        </span>
      </p>
    </div>
  );
}

export default Publications;
