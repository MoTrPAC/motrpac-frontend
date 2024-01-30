import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from '../../../lib/ui/externalLink';

// Common graphical clustering introduction component
function GraphicalClusteringIntroduction({ currentView }) {
  return (
    <div className="section level2 border-bottom pb-2" id="introduction">
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
        {currentView && currentView === 'pass1b-06-mitochondria' ? (
          <li>To highlight results related to mitochondrial genes</li>
        ) : null}
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
          <code>1w_F-1_M-1</code> is a node that characterizes molecules at the{' '}
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

GraphicalClusteringIntroduction.propTypes = {
  currentView: PropTypes.string.isRequired,
};

export default GraphicalClusteringIntroduction;
