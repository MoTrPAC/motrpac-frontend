import React from 'react';
import PropTypes from 'prop-types';
import { KIND_LABELS, KIND_ORDER } from '../../lib/studyDataCards';

const KIND_LETTERS = {
  quantID: 'Q',
  analysis: 'A',
  phenotype: 'P',
};

/**
 * The lettered, colour-coded label for a collection family (Quant-ID, Analysis,
 * Phenotype) used throughout the data collections views.
 */
function KindChip({ kind }) {
  return (
    <span className={`kind-chip kind-chip-${kind} d-inline-flex align-items-center font-weight-bold`}>
      <span className="kind-chip-letter d-inline-flex align-items-center justify-content-center mr-2">
        {KIND_LETTERS[kind]}
      </span>
      <span>{KIND_LABELS[kind]}</span>
    </span>
  );
}

KindChip.propTypes = {
  kind: PropTypes.oneOf(KIND_ORDER).isRequired,
};

export default KindChip;
