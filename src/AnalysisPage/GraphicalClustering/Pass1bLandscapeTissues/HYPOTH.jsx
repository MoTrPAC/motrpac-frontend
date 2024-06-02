import React, { useEffect } from 'react';
import * as tocbot from 'tocbot';
import {
  tocbotConfig,
  pass1b06GraphicalClusteringLandscapeImageLocation,
} from '../sharedLib';
import DataVizLink from '../components/dataVizLink';
import PathwayNetworkDescription from '../components/pathwayNetworkDescription';

function GraphicalAnalysisHypothalamus() {
  // initialize table of contents
  useEffect(() => {
    tocbot.init(tocbotConfig);
  }, []);

  // load plot images
  const tissueImageFolder = 'hypothalamus';
  const imageURL = `${pass1b06GraphicalClusteringLandscapeImageLocation}/${tissueImageFolder}`;

  return (
    <div className="container-fluid main-container">
      <div className="row">
        <div className="col-xs-12 col-sm-4 col-md-3">
          <div className="tocify" id="TOC" />
        </div>
        <div className="toc-content col-xs-12 col-sm-8 col-md-9">
          <div className="section level2">
            <h2 id="graph-characteristics">Graph characteristics</h2>
            <p>
              Graphical analysis has replaced clustering as the primary method
              of exploring main patterns in the PASS1B data. This approach is
              more flexible and gives us better resolution.
            </p>
            <div className="section level3">
              <h3 id="all-paths">All paths</h3>
              <p>Tree of ALL differential analytes (all paths)</p>
              <p>
                <img src={`${imageURL}/figure_1.png`} width="100%" alt="" />
              </p>
              <DataVizLink
                title="trajectory"
                tissue="Hypothalamus"
                plotType="Tree"
                minClusterSize={1}
              />
            </div>
            <div className="section level3">
              <h3 id="top-clusters">Top clusters</h3>
              <p>
                A “cluster” is a path, node, or edge. Here we show the size and
                ome distributions for selected clusters in this tissue.
              </p>
              <p>
                <img src={`${imageURL}/figure_2.png`} width="100%" alt="" />
              </p>
              <DataVizLink
                title="cluster"
                tissue="Hypothalamus"
                plotType="Histogram"
                minClusterSize={1}
              />
            </div>
          </div>
          <div className="section level2">
            <h2 id="top-5-trajectories">Top 5 trajectories</h2>
            <p>
              Here we show trees of the 5 largest trajectories (also called
              paths) in this tissue, either with all differential features or
              features split by ome group.
            </p>
            <div className="section level3">
              <h3 id="all-omes">All omes</h3>
              <p>
                <img src={`${imageURL}/figure_3.png`} width="100%" alt="" />
              </p>
            </div>
            <div className="section level3">
              <h3 id="split-by-ome-group">Split by ome group</h3>
              <p>
                <img src={`${imageURL}/figure_4.png`} width="100%" alt="" />
              </p>
            </div>
          </div>
          <div className="section level2">
            <PathwayNetworkDescription />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphicalAnalysisHypothalamus;
