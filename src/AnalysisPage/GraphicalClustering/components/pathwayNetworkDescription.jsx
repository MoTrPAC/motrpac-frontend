import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from '../../../lib/ui/externalLink';

function PathwayNetworkDescription({ tissue = null, clusterName = null }) {
  const tissueParam = tissue && tissue.length ? `tissues[${tissue}]=1&` : '';
  const clusterParam = clusterName && clusterName.length ? `&cluster=${clusterName}` : '';
  const url = `https://data-viz.motrpac-data.org/?${tissueParam}plot_type=Pathway${clusterParam}`;

  return (
    <>
      <h2 id="detailed-view-of-selected-clusters">Detailed view of selected clusters</h2>
      <p>
        Use the
        {' '}
        <ExternalLink
          to={url}
          label="interactive data visualization tool"
        />
        {' '}
        to explore multi-omic trajectories, top pathway enrichments, network
        view of
        {' '}
        <em>all</em>
        {' '}
        pathway enrichments, and sample-level trajectories for each
        selected cluster (node, edge, or path).
      </p>
      <p>
        <strong>Interactive networks of pathway enrichments</strong>
      </p>
      <p>
        The interactive networks available through the visualization tool
        summarize all significant pathway enrichments for a set of
        differential analytes. Results from all omes can be visualized.
      </p>
      <p>
        <strong>Each node is a pathway.</strong>
        {' '}
        Hover over a node to see the pathway name (and parent pathway in
        parentheses), nominal enrichment p-value, datasets in which this
        pathway was significantly enriched, and the union of genes at the
        intersection of the input features and pathway members. Larger
        nodes indicate that more datasets were significantly enriched for
        this pathway. Pathways only enriched with metabolites are not
        shown because network edges are defined using genes, not KEGG IDs.
      </p>
      <p>
        <strong>Edges</strong>
        {' '}
        are drawn between nodes if there is a substantial overlap in
        the intersection of the input features and pathway members for
        both pathways. Hover over an edge to see the similarity score and
        list of genes in the intersection.
      </p>
      <p>
        <strong>Colors</strong>
        {' '}
        are applied to nodes to visually separate groups of related
        pathway enrichments. Each group has a label, which corresponds
        to the most frequently occurring parent pathway in the group. These
        labels are meant to help summarize groups of related pathway
        enrichments.
      </p>
      <p>
        <ExternalLink
          to={url}
          label="Explore these interactive plots"
        />
      </p>
      <ul>
        <li>
          Hover over nodes (pathways) and edges (intersection between
          pathways) to see more information
        </li>
        <li>Click nodes to highlight them and connected edges</li>
        <li>Zoom in and out</li>
        <li>Click and drag nodes to adjust network visualization</li>
      </ul>
    </>
  );
}

PathwayNetworkDescription.propTypes = {
  tissue: PropTypes.string,
  clusterName: PropTypes.string,
};

export default PathwayNetworkDescription;
