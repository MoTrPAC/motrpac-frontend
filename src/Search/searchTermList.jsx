import React from 'react';
import PropTypes from 'prop-types';
import SearchTermRow from './searchTermRow';

import IconClinic from '../assets/searchIcons/clinic.png';
import IconDNA from '../assets/searchIcons/dna.png';
import IconFlask from '../assets/searchIcons/flask.png';
import IconGender from '../assets/searchIcons/gender.png';
import IconHeart from '../assets/searchIcons/heart.png';
import IconRat from '../assets/searchIcons/rat.png';
import IconVial from '../assets/searchIcons/vial.png';

const searchIconMapping = {
  assay: IconFlask,
  biospecimenid: IconVial,
  gene: IconDNA,
  sex: IconGender,
  site: IconClinic,
  species: IconRat,
  tissue: IconHeart,
};

function SearchTermList({
  advSearchParams,
  handleSearchFormChange,
  addSearchParam,
  removeSearchParam,
}) {
  // Render advanced search term/value pair list
  const advSearchParamListObj = advSearchParams.map((item, idx) => {
    const termId = `term-${idx}`;
    const valueId = `value-${idx}`;
    return (
      <li key={termId} className="param-item form-group d-flex align-items-center justify-content-start">
        <SearchTermRow
          advSearchParams={advSearchParams}
          item={item}
          termId={termId}
          valueId={valueId}
          idx={idx}
          handleSearchFormChange={handleSearchFormChange}
          addSearchParam={addSearchParam}
          removeSearchParam={removeSearchParam}
        />
      </li>
    );
  });

  // Render visuals for selected search term/value pairs
  const filteredParamList = advSearchParams.filter(item => (item.value && item.value.length) || item.term === 'all');

  const advSearchParamVisualContext = filteredParamList.map((item, idx) => {
    const termId = `term-${idx}`;
    const valueId = `value-${idx}`;
    return (
      <div key={`${termId}-${valueId}`} className="param-visual alert alert-info" role="alert">
        {item.term === 'all' ?
          <div><span>All</span></div>
          : (
            <div className="d-flex align-items-center">
              <img src={searchIconMapping[item.term]} alt={item.term} />
              <span>{item.value}</span>
            </div>
          )
        }
      </div>
    );
  });

  return (
    <div>
      <ul className="param-list">
        {advSearchParamListObj}
      </ul>
      <div className="param-list-visual-context d-flex align-items-center border-top pt-3 pb-3 mt-4 mb-4">
        <h6>Selected criteria:</h6>
        {advSearchParamVisualContext}
      </div>
    </div>
  );
}

SearchTermList.propTypes = {
  advSearchParams: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  })),
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
};

SearchTermList.defaultProps = {
  advSearchParams: [{ term: 'all', value: '', operator: 'and' }],
};

export default SearchTermList;
