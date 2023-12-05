import React from 'react';
import PageTitle from '../lib/ui/pageTitle';

const publications = [
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
export function Publications() {
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
    <div className="pub-item-content mt-4">
      <h4 className="pub-title">
        <a href={pub.url} target="_blank" rel="noopener noreferrer">
          {pub.title} <span className="oi oi-external-link" />
        </a>
      </h4>
      <p className="lead">
        <span className="pub-authors">{pub.authors}</span>
        <span className="pub-cite font-italic ml-1">{pub.cite}</span>
      </p>
    </div>
  );
}

export default Publications;
