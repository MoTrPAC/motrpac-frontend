import React, { useState } from 'react';
import PageTitle from '../../lib/ui/pageTitle';
import ExternalLink from '../../lib/ui/externalLink';
import Pass1bLandscapeGraphicalReport from './pass1bLandscapeReport';
import Pass1bMitochondriaGraphicalReport from './pass1bMitoReport';

const reportTissues = {
  ADRNL: 'Adrenal',
  BLOOD: 'Blood RNA',
  BAT: 'Brown Adipose',
  COLON: 'Colon',
  CORTEX: 'Cortex',
  SKM_GN: 'Gastrocnemius',
  HEART: 'Heart',
  HIPPOC: 'Hippocampus',
  HYPOTH: 'Hypothalamus',
  KIDNEY: 'Kidney',
  LIVER: 'Liver',
  LUNG: 'Lung',
  PLASMA: 'Plasma',
  SMLINT: 'Small Intestine',
  SPLEEN: 'Spleen',
  SKM_VL: 'Vastus Lateralis',
  WAT_SC: 'White Adipose',
};

function GraphicalClustering() {
  const [tissue, setTissue] = useState('SKM_GN');
  const [mitoTissue, setMitoTissue] = useState('HEART');
  const [currentView, setCurrentView] = useState('landscape');

  // Handler to set current view to either landscape or companion study
  function handleViewChange(study) {
    setCurrentView(study);
  }

  return (
    <div className="graphicalClusteringPage px-3 px-md-4 mb-3 container">
      <div className="row d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center page-header">
        <PageTitle title="Tissue-level visualization of graphical results" />
        <div className="btn-toolbar mb-3">
          <div
            className="btn-group"
            role="group"
            aria-label="graphical-clustering button group"
          >
            <button
              type="button"
              className={`btn btn-outline-primary btn-sm ${
                currentView === 'landscape' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'landscape')}
            >
              <span className="d-flex align-items-center">Landscape</span>
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary btn-sm ${
                currentView === 'mitochondria' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'mitochondria')}
            >
              <span className="d-flex align-items-center">Mitochondria</span>
            </button>
          </div>
        </div>
      </div>
      <div className="row graphical-clustering-container">
        {currentView === 'landscape' && (
          <LandscapeGraphicalClustering tissue={tissue} setTissue={setTissue} />
        )}
        {currentView === 'mitochondria' && (
          <MitoChondriaGraphicalAnalysis
            tissue={mitoTissue}
            setTissue={setMitoTissue}
          />
        )}
      </div>
    </div>
  );
}

export default GraphicalClustering;

// Tissue selection dropdown component
function ReportControls({ tissue, toggleReport }) {
  const tissueKeys = Object.keys(reportTissues);

  return (
    <div className="controlPanelContainer container mt-1 ml-3">
      <div className="controlPanel row border-top pt-3">
        <div className="controlRow d-flex align-items-center">
          <div className="controlLabel mr-2 font-weight-bold">
            Select tissue:
          </div>
          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="reportViewMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {reportTissues[tissue]}
            </button>
            <div
              className="dropdown-menu animate slideIn"
              aria-labelledby="reportViewMenu"
            >
              {tissueKeys.map((key) => {
                return (
                  <button
                    key={key}
                    className="dropdown-item"
                    type="button"
                    onClick={toggleReport.bind(this, key)}
                  >
                    {reportTissues[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Landscape graphical clustering component
function LandscapeGraphicalClustering({ tissue, setTissue }) {
  return (
    <div className="graphical-clustering-summary-container row mb-2">
      <div className="lead col-12">
        Explore multi-omic changes and associated pathway enrichment results
        over the training time course per tissue in adult rats. Compare
        responses between male and female rats, identify pathways affected in
        single or multiple omes' and explore what molecules drive those
        enrichments. See the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v3"
          label="study's landscape preprint"
        />{' '}
        and the{' '}
        <ExternalLink
          to="https://motrpac.github.io/MotrpacRatTraining6mo/articles/MotrpacRatTraining6mo.html"
          label="documentation"
        />{' '}
        to learn more.
      </div>
      <GraphicalClusteringIntroduction />
      <ReportControls tissue={tissue} toggleReport={setTissue} />
      <div className="graphical-clustering-content-container mt-3">
        <Pass1bLandscapeGraphicalReport tissue={tissue} />
      </div>
    </div>
  );
}

// Mitochondria graphical analysis component
function MitoChondriaGraphicalAnalysis({ tissue, setTissue }) {
  return (
    <div className="graphical-clustering-summary-container row mb-2">
      <div className="lead col-12">
        Explore the mitochondria-selected (using{' '}
        <ExternalLink
          to="https://www.broadinstitute.org/mitocarta/mitocarta30-inventory-mammalian-mitochondrial-proteins-and-pathways"
          label="MitoCarta"
        />
        ) multi-omic changes and associated pathway enrichment results over the
        training time course per tissue in adult rats. Compare responses between
        male and female rats, identify pathways affected in single or multiple
        omes' and explore what molecules drive those enrichments. To learn more,
        see the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2023.01.13.523698v1"
          label="MoTrPAC mitochondrial companion preprint"
        />
        .
      </div>
      <GraphicalClusteringIntroduction />
      <ReportControls tissue={tissue} toggleReport={setTissue} />
      <div className="graphical-clustering-content-container mt-2">
        <Pass1bMitochondriaGraphicalReport tissue={tissue} />
      </div>
    </div>
  );
}

// Common introduction component
function GraphicalClusteringIntroduction() {
  return (
    <div className="section level2" id="introduction">
      <h2 id="section_introduction">Introduction</h2>
      <p>
        <strong>Objectives of these reports:</strong>
      </p>
      <ul>
        <li>
          To share representations of complex data as interactive reports that
          allow researchers to extract meaningful biology
          <br />
        </li>
        <li>
          To compile biological insights from these reports, some of which will
          be included in the landscape manuscript and companions
        </li>
      </ul>
      <p>
        <strong>Background about graphical clustering analysis:</strong>
      </p>
      <p>
        A graphical approach with <code>repfdr</code> has replaced multiomics
        clustering as the primary method to characterize and explore main
        patterns of training-differential analytes in the PASS1B data. To learn
        more about this approach, see presentations by David Amar{' '}
        <ExternalLink
          to="https://docs.google.com/presentation/d/1j7bhPO0S3Yz6nf21ljM-x7GrMoBdaGL67XPox9kByok/edit?usp=sharing"
          label="here"
        />{' '}
        and{' '}
        <ExternalLink
          to="https://docs.google.com/presentation/d/1NrsHfF8ki312D2fjhbmWSRER19aco3AA2EQ6A-HQLlQ/edit?usp=sharing"
          label="here"
        />
        .
      </p>
      <p>
        Briefly, each differential molecule is assigned one of nine states
        [(male up/1, male null/0, male down/-1) x (female up/1, female null/0,
        female down/-1)] for each training time point (1, 2, 4, and 8 weeks).
        These states are our <code>nodes</code> in the graphs. Then, for each
        pair of nodes (x,y) such that y is from a time point that is immediately
        after x (e.g., x is a node from week 4 and y is a node from week 8), we
        define their edge set as the intersection of their analytes. This
        defines the <code>edges</code> in the graphs. By visualizing these
        graphs and characterizing different nodes, edges, and paths (i.e. a set
        of edges that traverses all time points), we can extract meaningful
        biology.
      </p>
      <p>
        We refer to sets of molecules in specific edges, nodes, or paths as{' '}
        <strong>graphical clusters</strong>. Throughout this report, you will
        see labels for these clusters, e.g.{' '}
        <code>
          "SKM-GN:1w_F-1_M-1-&gt;2w_F-1_M-1-&gt;4w_F-1_M-1-&gt;8w_F-1_M-1"
        </code>
        . Here’s how to break it down:
      </p>
      <ul>
        <li>
          All clusters are prefixed with the tissue abbreviation and a colon,
          e.g. <code>SKM-GN:</code>
          <br />
        </li>
        <li>
          Nodes are defined by the time point and state in each sex, where state
          is 1 for up, 0 for null, and -1 for down. For example,{' '}
          <code>1w_F-1_M-1</code> is a node that characterizes molecules at the
          <code>1w</code> time point that are down-regulated in females (
          <code>F-1</code>) and down-regulated in males (<code>M-1</code>).
          These three pieces of information (time point, female state, male
          state) are separated by underscores (<code>_</code>)<br />
        </li>
        <li>
          Edges contain <code>---</code> and connect a pair of nodes
          <br />
        </li>
        <li>
          Paths contain <code>-&gt;</code> and connect four nodes
        </li>
      </ul>
    </div>
  );
}
