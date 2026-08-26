import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';

// The application's own stylesheet. Vite lib builds emit CSS as a separate
// artifact rather than injecting it, so the consumer must import it — without
// this the app renders with only antd's runtime-injected styles and none of its
// own layout, which looks *almost* right and puts the sidebar over the content.
import '@motrpac/precawg-dataviz/style.css';
import '@styles/dataViz.scss';

/**
 * The PreCAWG data visualization application, as a page of this portal.
 *
 * It is a separate React 18 + Vite application (the js/python port of the R
 * Shiny app) consumed as a package, `@motrpac/precawg-dataviz`. Because both
 * applications are React 18, it renders inside THIS React tree — no iframe, no
 * second React runtime, no imperative mount/unmount lifecycle.
 *
 * Loaded lazily, matching how App.jsx treats every other heavy page: the
 * visualization bundle is large (charts, vega, antd) and nobody who never opens
 * this page should download it.
 */
const PrecawgDataViz = lazy(() =>
  import('@motrpac/precawg-dataviz').then((m) => ({ default: m.PrecawgDataViz })),
);

/**
 * Where the visualization reaches its API and its own runtime assets.
 *
 * `apiBase` is the path this site's web server reverse-proxies to the PreCAWG
 * FastAPI service, which stays deployed separately on its own cluster. Both are
 * env-overridable so a developer can point at a local backend without editing
 * source.
 */
const API_BASE = import.meta.env.VITE_PRECAWG_API_BASE || '/precawg';
const ASSET_BASE = import.meta.env.VITE_PRECAWG_ASSET_BASE || '/precawg-embed';

/**
 * Renders the interactive data visualization page.
 *
 * @returns {object} JSX representation of the data visualization page
 */
function DataVizPage() {
  return (
    <div className="dataVizPage px-3 px-md-4 mb-3 container-fluid">
      <Helmet>
        <html lang="en" />
        <title>Data Visualization - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Data Visualization" />
      <Suspense
        fallback={
          <div className="dataviz-loading d-flex justify-content-center align-items-center">
            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
            Loading the visualization…
          </div>
        }
      >
        <PrecawgDataViz apiBase={API_BASE} assetBase={ASSET_BASE} />
      </Suspense>
    </div>
  );
}

export default DataVizPage;
