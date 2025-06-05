import React, { useEffect } from 'react';
import * as tocbot from 'tocbot';
import {
  tocbotConfig,
  pass1b06GraphicalClusteringMitoImageLocation,
} from '../sharedLib';
import DataVizLink from '../components/dataVizLink';
import PathwayNetworkDescription from '../components/pathwayNetworkDescription';

function MitoGraphicalAnalysisSpleen() {
  // initialize table of contents
  useEffect(() => {
    tocbot.init(tocbotConfig);
  }, []);

  // load plot images
  const tissueImageFolder = 'spleen';
  const imageURL = `${pass1b06GraphicalClusteringMitoImageLocation}/${tissueImageFolder}`;

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
              <DataVizLink title="trajectory" tissue="Spleen" plotType="Tree" />
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
                tissue="Spleen"
                plotType="Histogram"
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
              <p>
                <img src={`${imageURL}/figure_5.png`} width="100%" alt="" />
              </p>
            </div>
          </div>
          <div className="section level2">
            <PathwayNetworkDescription />
            <div className="section level3">
              <h3 id="selected-paths">Selected paths</h3>
              <div className="section level4">
                <h4 id="spleen1w_f0_m0-2w_f0_m0-4w_f0_m0-8w_f1_m1">
                  SPLEEN:1w_F0_M0-&gt;2w_F0_M0-&gt;4w_F0_M0-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_6.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_7.png`} width="100%" alt="" />
                </p>
                <DataVizLink
                  title="timecourse"
                  tissue="Spleen"
                  plotType="Trajectories"
                />
                <p>
                  No significant enrichments for
                  SPLEEN:1w_F0_M0-&gt;2w_F0_M0-&gt;4w_F0_M0-&gt;8w_F1_M1
                </p>
                <hr />
              </div>
            </div>
            <div className="section level3">
              <h3 id="selected-nodes">Selected nodes</h3>
              <div className="section level4">
                <h4 id="spleen8w_f1_m1">SPLEEN:8w_F1_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_8.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_9.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_10.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="spleen1w_f1_m0">SPLEEN:1w_F1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_11.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_12.png`} width="100%" alt="" />
                  No significant enrichments for SPLEEN:1w_F1_M0
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="spleen8w_f0_m1">SPLEEN:8w_F0_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_13.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_14.png`} width="100%" alt="" />
                  No significant enrichments for SPLEEN:8w_F0_M1
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="spleen8w_f1_m0">SPLEEN:8w_F1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_15.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_16.png`} width="100%" alt="" />
                  No significant enrichments for SPLEEN:8w_F1_M0
                </p>
                <hr />
              </div>
            </div>
            <div className="section level3">
              <h3 id="selected-edges">Selected edges</h3>
              <div className="section level4">
                <h4 id="spleen1w_f1_m02w_f1_m0">SPLEEN:1w_F1_M0—2w_F1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_17.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_18.png`} width="100%" alt="" />
                  No significant enrichments for SPLEEN:1w_F1_M0—2w_F1_M0
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="spleen1w_f0_m12w_f0_m1">SPLEEN:1w_F0_M1—2w_F0_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_19.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_20.png`} width="100%" alt="" />
                  No significant enrichments for SPLEEN:1w_F0_M1—2w_F0_M1
                </p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MitoGraphicalAnalysisSpleen;
