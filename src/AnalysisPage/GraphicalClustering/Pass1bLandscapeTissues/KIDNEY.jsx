import React, { useEffect } from 'react';
import * as tocbot from 'tocbot';
import {
  tocbotConfig,
  pass1b06GraphicalClusteringLandscapeImageLocation,
} from '../sharedLib';

function GraphicalAnalysisKidney() {
  // initialize table of contents
  useEffect(() => {
    tocbot.init(tocbotConfig);
  }, []);

  // load plot images
  const tissueImageFolder = 'kidney';
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
                <img src={`${imageURL}/figure_5.png`} width="100%" alt="" />
                <img src={`${imageURL}/figure_6.png`} width="100%" alt="" />
              </p>
            </div>
          </div>
          <div className="section level2">
            <h2 id="detailed-view-of-selected-clusters">
              Detailed view of selected clusters
            </h2>
            <p>
              Here we show highlighted trees, top pathway enrichments, network
              view of <em>all</em> pathway enrichments, and sample-level
              trajectories for each selected cluster (node, edge, or path).
            </p>
            <p>
              <strong>Interactive networks of pathway enrichments</strong>
            </p>
            <p>
              These networks summarize all significant pathway enrichments for a
              set of differential analytes. Results from all omes are combined.
            </p>
            <p>
              Each node is a pathway. Hover over a node to see the pathway name
              (and parent pathway in parentheses), nominal enrichment p-value,
              datasets in which this pathway was significantly enriched, and the
              union of genes at the intersection of the input features and
              pathway members. Larger nodes indicate that more datasets (e.g.
              METAB;SKM-GN) were significantly enriched for this pathway.{' '}
              <strong>
                Pathways only enriched with metabolites are not shown because
                edges are defined using genes, not KEGG IDs.
              </strong>
            </p>
            <p>
              Edges are drawn between nodes if there is a substantial overlap in
              the intersection of the input features and pathway members for
              both pathways. Hover over an edge to see the similarity score and
              list of genes in the intersection.
            </p>
            <p>
              Nodes are colored to visually separate groups of related pathway
              enrichments. Each group has a label (rectangular node), which
              corresponds to the most frequently occurring parent pathway in the
              group. These labels are meant to help summarize groups of related
              pathway enrichments.
            </p>
            <p>Explore these interactive plots!</p>
            <ul>
              <li>
                Hover over nodes (pathways) and edges (intersection between
                pathways) to see more information
                <br />
              </li>
              <li>
                Click nodes to highlight them and connected edges
                <br />
              </li>
              <li>
                Zoom in and out
                <br />
              </li>
              <li>Click and drag nodes</li>
            </ul>
            <div className="section level3">
              <h3 id="selected-paths">Selected paths</h3>
              <div className="section level4">
                <h4 id="kidney1w_f1_m1-2w_f1_m1-4w_f1_m1-8w_f1_m1">
                  KIDNEY:1w_F1_M1-&gt;2w_F1_M1-&gt;4w_F1_M1-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_7.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_8.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_9.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney1w_f-1_m-1-2w_f-1_m-1-4w_f-1_m-1-8w_f-1_m-1">
                  KIDNEY:1w_F-1_M-1-&gt;2w_F-1_M-1-&gt;4w_F-1_M-1-&gt;8w_F-1_M-1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_10.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_11.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_12.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney1w_f-1_m0-2w_f-1_m0-4w_f-1_m0-8w_f-1_m-1">
                  KIDNEY:1w_F-1_M0-&gt;2w_F-1_M0-&gt;4w_F-1_M0-&gt;8w_F-1_M-1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_13.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_14.png`} width="100%" alt="" />
                  No significant enrichments for
                  KIDNEY:1w_F-1_M0-&gt;2w_F-1_M0-&gt;4w_F-1_M0-&gt;8w_F-1_M-1
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney1w_f0_m0-2w_f0_m0-4w_f0_m0-8w_f1_m1">
                  KIDNEY:1w_F0_M0-&gt;2w_F0_M0-&gt;4w_F0_M0-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_15.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_16.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_17.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney1w_f1_m0-2w_f1_m0-4w_f0_m0-8w_f1_m1">
                  KIDNEY:1w_F1_M0-&gt;2w_F1_M0-&gt;4w_F0_M0-&gt;8w_F1_M1
                </h4>
                <p>
                  <img src={`${imageURL}/figure_18.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_19.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_20.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
            </div>
            <div className="section level3">
              <h3 id="selected-nodes">Selected nodes</h3>
              <div className="section level4">
                <h4 id="kidney8w_f1_m1">KIDNEY:8w_F1_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_21.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_22.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_23.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney8w_f-1_m-1">KIDNEY:8w_F-1_M-1</h4>
                <p>
                  <img src={`${imageURL}/figure_24.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_25.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_26.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney8w_f-1_m0">KIDNEY:8w_F-1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_27.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_28.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_29.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney8w_f0_m-1">KIDNEY:8w_F0_M-1</h4>
                <p>
                  <img src={`${imageURL}/figure_30.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_31.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_32.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney8w_f0_m1">KIDNEY:8w_F0_M1</h4>
                <p>
                  <img src={`${imageURL}/figure_33.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_34.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_35.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
              <div className="section level4">
                <h4 id="kidney8w_f1_m0">KIDNEY:8w_F1_M0</h4>
                <p>
                  <img src={`${imageURL}/figure_36.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_37.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_38.png`} width="100%" alt="" />
                </p>
                <hr />
              </div>
            </div>
            <div className="section level3">
              <h3 id="selected-edges">Selected edges</h3>
              <div className="section level4">
                <h4 id="kidney1w_f-1_m02w_f-1_m0">
                  KIDNEY:1w_F-1_M0—2w_F-1_M0
                </h4>
                <p>
                  <img src={`${imageURL}/figure_39.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_40.png`} width="100%" alt="" />
                  <img src={`${imageURL}/figure_41.png`} width="100%" alt="" />
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

export default GraphicalAnalysisKidney;
