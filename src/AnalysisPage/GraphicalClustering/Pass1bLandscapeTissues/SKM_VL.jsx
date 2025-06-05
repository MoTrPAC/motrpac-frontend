import React, { useEffect } from 'react';
import * as tocbot from 'tocbot';
import {
  tocbotConfig,
  pass1b06GraphicalClusteringLandscapeImageLocation,
} from '../sharedLib';
import DataVizLink from '../components/dataVizLink';
import PathwayNetworkDescription from '../components/pathwayNetworkDescription';

function GraphicalAnalysisVastusLateralis() {
  // initialize table of contents
  useEffect(() => {
    tocbot.init(tocbotConfig);
  }, []);

  // load plot images
  const tissueImageFolder = 'vastus_lateralis';
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
                tissue="Vastus Lateralis"
                plotType="Tree"
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
                tissue="Vastus Lateralis"
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
            </div>
          </div>
          <div className="section level2">
            <PathwayNetworkDescription
              tissue="Vastus Lateralis"
              clusterName="1w_F-1_M0-&gt;2w_F-1_M0-&gt;4w_F-1_M0-&gt;8w_F-1_M-1"
            />
            <div className="section level3">
              <h3 id="selected-paths">Selected paths</h3>
              <div className="section level4">
                <h4 id="skm-vl1w_f-1_m0-2w_f-1_m0-4w_f-1_m0-8w_f-1_m-1">
                  SKM-VL:1w_F-1_M0-&gt;2w_F-1_M0-&gt;4w_F-1_M0-&gt;8w_F-1_M-1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_5.png`} width="100%" alt="" />
                </p>
                <p>
                  <img src={`${imageURL}/figure_6.png`} width="100%" alt="" />
                </p>
                <DataVizLink
                  title="pathway enrichment"
                  tissue="Vastus Lateralis"
                  plotType="Pathway"
                  clusterName="1w_F-1_M0-&gt;2w_F-1_M0-&gt;4w_F-1_M0-&gt;8w_F-1_M-1"
                />
                <p>
                  <img src={`${imageURL}/figure_7.png`} width="100%" alt="" />
                </p>
                <DataVizLink
                  title="timecourse"
                  tissue="Vastus Lateralis"
                  plotType="Trajectories"
                />
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl1w_f1_m1-2w_f1_m1-4w_f1_m1-8w_f1_m1">
                  SKM-VL:1w_F1_M1-&gt;2w_F1_M1-&gt;4w_F1_M1-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_8.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_9.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_10.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl1w_f1_m0-2w_f1_m0-4w_f1_m0-8w_f1_m1">
                  SKM-VL:1w_F1_M0-&gt;2w_F1_M0-&gt;4w_F1_M0-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_11.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_12.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_13.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl1w_f1_m0-2w_f1_m0-4w_f1_m0-8w_f1_m0">
                  SKM-VL:1w_F1_M0-&gt;2w_F1_M0-&gt;4w_F1_M0-&gt;8w_F1_M0
                </h4>
                <p>
                  <img src={`${imageURL}/figure_14.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_15.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_16.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl1w_f0_m1-2w_f0_m1-4w_f1_m1-8w_f1_m1">
                  SKM-VL:1w_F0_M1-&gt;2w_F0_M1-&gt;4w_F1_M1-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_17.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_18.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_19.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
            </div>
            <div className="section level3">
              <h3 id="selected-nodes">Selected nodes</h3>
              <div className="section level4">
                <h4 id="skm-vl8w_f1_m1">SKM-VL:8w_F1_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_20.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_21.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_22.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl4w_f1_m1">SKM-VL:4w_F1_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_23.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_24.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_25.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl8w_f-1_m-1">SKM-VL:8w_F-1_M-1</h4>
                <p>
                  <img src={`${imageURL}/figure_26.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_27.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_28.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl8w_f-1_m0">SKM-VL:8w_F-1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_29.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_30.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_31.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl8w_f0_m1">SKM-VL:8w_F0_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_32.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_33.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_34.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl8w_f1_m0">SKM-VL:8w_F1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_35.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_36.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_37.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
            </div>
            <div className="section level3">
              <h3 id="selected-edges">Selected edges</h3>
              <div className="section level4">
                <h4 id="skm-vl4w_f1_m18w_f1_m1">SKM-VL:4w_F1_M1—8w_F1_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_38.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_39.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_40.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="skm-vl2w_f-1_m04w_f-1_m0">
                  SKM-VL:2w_F-1_M0—4w_F-1_M0
                </h4>
                <p>
                  <img src={`${imageURL}/figure_41.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_42.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_43.png`} width="100%" alt="" />
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

export default GraphicalAnalysisVastusLateralis;
