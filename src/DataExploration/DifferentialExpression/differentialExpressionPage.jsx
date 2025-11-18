import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import FigureAssayLegends from './figureAssayLegends';
import HeatmapModal from './heatmapModal';

import '@styles/differentialExpression.scss';

const imgSourceUrl =
  'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/images/figures/';

/**
 * Renders the data exploration page in both
 * unauthenticated and authenticated states.
 *
 * @returns {Object} JSX representation of the data exploration page.
 */
function DifferentialExpression() {
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
    d3.xml(`${imgSourceUrl}rat-figure-pass1b.svg`)
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
            '#AssayLegends rect, #AssayLegends circle, #AssayLegends polygon',
          ),
        );
        assaySymbols.forEach((symbol) => {
          const selectedAssay = d3.select(symbol);
          if (selectedAssay.attr('class') !== 'metab') {
            selectedAssay.on('click', (event) => {
              activateModal(
                d3.select(event.currentTarget.parentNode).attr('class'),
                selectedAssay.attr('class'),
              );
            });
          } else {
            const assayTooltip = document.querySelector('.data-status-tooltip');
            selectedAssay.on('mouseover', () => {
              assayTooltip.classList.add('show');
            });
            selectedAssay.on('mouseout', () => {
              assayTooltip.classList.remove('show');
            });
          }
        });
      });
  }

  useEffect(() => {
    renderFigure();
  }, []);

  return (
    <div className="differentialExpressionPage">
      <div className="main-content-container row">
        <div
          className="figure-svg-container my-3 text-center col-9"
          id="figure-svg-container"
          ref={ref}
        >
          <div className="data-status-tooltip">
            <span className="data-status-tooltip-content">
              Data unavailable
            </span>
          </div>
        </div>
        <div className="figure-assay-legends-wrapper my-4 col-3">
          <FigureAssayLegends />
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
    </div>
  );
}

export default DifferentialExpression;
