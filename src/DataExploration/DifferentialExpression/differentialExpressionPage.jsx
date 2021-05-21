import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import AuthContentContainer from '../../lib/ui/authContentContainer';
import figureRat from '../../assets/figures/rat-figure-pass1b.svg';
import FigureAssayLegends from './figureAssayLegends';
import HeatmapModal from './heatmapModal';

const figureTissueProps = require('./figureTissueProps');

/**
 * Renders the data exploration page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Boolean} expanded        Redux state for sidebar
 *
 * @returns {Object} JSX representation of the data exploration page.
 */
function DifferenrialExpression({ isAuthenticated, expanded }) {
  const [tissue, setTissue] = useState();
  const [assay, setAssay] = useState();
  const [showModal, setShowModal] = useState(false);
  const ref = useRef();

  // Handler to open modal
  function activateModal(tissueAbbr, assayType) {
    setTissue(tissueAbbr);
    setAssay(assayType);
    setShowModal(true);
    const body = document.querySelector('body');
    body.classList.add('modal-open');
  }

  // Handle to close heatmap modal
  function dismissModal() {
    setShowModal(false);
    const body = document.querySelector('body');
    body.classList.remove('modal-open');
  }

  // Draw svg rat figure with labels
  function renderFigure() {
    // import svg rat figure as xml
    d3.xml(figureRat)
      .then((data) => {
        const svgFigure = data.documentElement;
        d3.select(ref.current).node().append(svgFigure);
        return Promise.resolve(svgFigure);
      })
      .then((figure) => {
        // handle click event on label 'rect'
        /* >> tissue labels are temporarily non-interactive
        const labelRects = Array.from(
          document.querySelectorAll('#TissueLabels #Labels rect')
        );
        labelRects.forEach((rect) => {
          const selectedLabel = d3.select(rect);
          selectedLabel.on('click', (event) => {
            setTissue(figureTissueProps[selectedLabel.attr('class')].label);
            setAssay('');
          });
        });
        */
        // handle click event on label text 'path'
        /* >> tissue labels are temporarily non-interactive
        const labelTextGroups = Array.from(
          document.querySelectorAll('#TissueLabels #Labels g')
        );
        labelTextGroups.forEach((group) => {
          const selectedLabelText = d3.select(group);
          selectedLabelText.selectAll('path').on('click', (event) => {
            setTissue(figureTissueProps[selectedLabelText.attr('class')].label);
            setAssay('');
          });
          selectedLabelText.selectAll('path').on('mouseover', () => {
            const rect = document.querySelector(
              `#TissueLabels #Labels rect[data-name=${selectedLabelText.attr(
                'class'
              )}]`
            );
            d3.select(rect).classed('hover', true);
          });
          selectedLabelText.selectAll('path').on('mouseout', () => {
            const rect = document.querySelector(
              `#TissueLabels #Labels rect[data-name=${selectedLabelText.attr(
                'class'
              )}]`
            );
            d3.select(rect).classed('hover', false);
          });
        });
        */
        // handle click event on assay legend symbols
        const assaySymbols = Array.from(
          document.querySelectorAll(
            '#AssayLegends rect, #AssayLegends circle, #AssayLegends polygon'
          )
        );
        assaySymbols.forEach((symbol) => {
          const selectedAssay = d3.select(symbol);
          if (selectedAssay.attr('class') !== 'metab') {
            selectedAssay.on('click', (event) => {
              activateModal(
                d3.select(event.currentTarget.parentNode).attr('class'),
                selectedAssay.attr('class')
              );
            });
          } else {
            // create assay tooltip
            const assayTooltip = d3
              .select(ref.current)
              .append('div')
              .style('display', 'none')
              .attr('class', 'assay-symbol-tooltip');
            // assay tooltip functions
            const hover = (event, d) => {
              assayTooltip
                .html('Data unavailable')
                .style('top', (event.pageY + 5) + 'px')
                .style('left', (event.pageX + 5) + 'px');
              assayTooltip.transition().duration(300).style('display', 'block');
              d3.select(this).style('display', 'block');
            };
            const move = (event, d) => {
              assayTooltip
                .html('Data unavailable')
                .style('top', (event.pageY + 5) + 'px')
                .style('left', (event.pageX + 5) + 'px');
            };
            const mouseout = (d) => {
              assayTooltip.transition().duration(500).style('display', 'none');
              d3.select(this).style('display', 'none');
            };
            selectedAssay
              .on('mouseover', hover)
              .on('mousemove', move)
              .on('mouseout', mouseout);
          }
        });
      });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    renderFigure();
  }, []);

  const pageContent = (
    <>
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>
          Assay-level differentially expressed genes in response to training
        </h3>
      </div>
      <div className="main-content-container d-flex align-items-start">
        <div
          className="figure-svg-container my-3 text-left"
          id="figure-svg-container"
          ref={ref}
        />
        <FigureAssayLegends />
        <div className="results-container mt-5 ml-5 p-3 border border-dark rounded">
          <p>Selected tissue: {tissue}</p>
          <p>Selected assay: {assay}</p>
        </div>
      </div>
      {showModal && (
        <HeatmapModal
          tissue={tissue}
          assay={assay}
          showModal={showModal}
          dismissModal={dismissModal}
        />
      )}
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className="w-100 px-4 differentialExpressionPage">
        <div className="container-fluid">{pageContent}</div>
      </div>
    );
  }

  return (
    <AuthContentContainer
      classes="differentialExpressionPage"
      expanded={expanded}
    >
      <div>{pageContent}</div>
    </AuthContentContainer>
  );
}

DifferenrialExpression.propTypes = {
  isAuthenticated: PropTypes.bool,
  expanded: PropTypes.bool,
};

DifferenrialExpression.defaultProps = {
  isAuthenticated: false,
  expanded: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  expanded: state.sidebar.expanded,
});

export default connect(mapStateToProps)(DifferenrialExpression);
