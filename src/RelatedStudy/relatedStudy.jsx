import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
import HeritageFamilyStudyLogo from '../assets/ExternalLogos/HeritageFamilyStudy.png';
import StanfordMedicineLogo from '../assets/ExternalLogos/StanfordMedicine.png';

const relatedStudies = [
  {
    url: '/related-studies/heritage-proteomics',
    text:
      'The HERITAGE Family Study is a multicenter project whose main goal is to study the role of the genotype in the cardiovascular and metabolic responses to aerobic exercise training and the changes brought about by regular exercise for several cardiovascular disease and diabetes risk factors.',
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

function RelatedStudy() {
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
    <div className="relatedStudyPage px-3 px-md-4 mb-3 container">
      <PageTitle title="Related Exercise Studies" />
      <div className="related-studies-container my-4">
        <div className="related-studies-content-container">
          {relatedStudyLinks()}
        </div>
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
        <h5 className="card-title">
          {study.newWin && (
            <a href={study.url} target="_blank" rel="noopener noreferrer">
              {study.title} <span className="oi oi-external-link" />
            </a>
          )}
          {!study.newWin && <Link to={study.url}>{study.title}</Link>}
        </h5>
        <p className="card-text">{study.text}</p>
      </div>
    </div>
  );
}

export default RelatedStudy;
