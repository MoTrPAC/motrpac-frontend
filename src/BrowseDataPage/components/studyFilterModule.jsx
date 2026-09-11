import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import actions from '../browseDataActions';
import {
  availableStudies,
  resolveScope,
  scopeCollections,
  scopeToPath,
  studyName,
} from '../../lib/collectionScope';

/**
 * Which studies the file browser has in scope.
 *
 * Study is the only facet that changes what is *loaded*; the rest filter what is
 * already in memory. Keeping that distinction is what stops "browse everything"
 * from meaning "fetch every study before you can filter anything", so this
 * control navigates and reloads while the others do not.
 *
 * It follows the same empty-means-everything rule as the facets below it, with
 * no exceptions: nothing checked is every study, exactly as no tissue checked is
 * every tissue. Checking every study one by one collapses back to nothing
 * checked, because those describe the same set and two representations of one
 * state is what made this control confusing.
 */
function StudyFilterModule({ userType = undefined }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loadingFiles = useSelector((state) => state.browseData.loadingFiles);

  const { inFileBrowser, studyCodes } = resolveScope(location, userType);
  const available = availableStudies(userType);
  if (!inFileBrowser || available.length <= 1) {
    return null;
  }

  function apply(nextStudies) {
    // Asking for none and asking for all describe the same set, so both collapse
    // to none -- one state, one representation, one URL.
    const scope = nextStudies.length === available.length ? [] : nextStudies;
    const prefixes = scopeCollections(scope, userType);
    // Widening or narrowing the scope resets the collection selection: a
    // collection chosen from a study that is no longer in scope would be a
    // filter the user cannot see or clear.
    dispatch(actions.selectCollections(prefixes, []));
    navigate(scopeToPath(scope, []));
  }

  function toggle(code) {
    apply(
      studyCodes.includes(code)
        ? studyCodes.filter((candidate) => candidate !== code)
        : [...studyCodes, code]
    );
  }

  return (
    <div className="card filter-module study-filter-module mb-4">
      <div className="card-header font-weight-bold d-flex align-items-center">
        <div>Study</div>
      </div>
      <div className="card-body">
        {available.map((code) => {
          const selected = studyCodes.includes(code);
          return (
            <button
              key={code}
              type="button"
              disabled={loadingFiles}
              aria-pressed={selected}
              className={`btn filterBtn ${selected ? 'activeFilter' : ''}`}
              onClick={() => toggle(code)}
            >
              {studyName(code) || code}
            </button>
          );
        })}
      </div>
    </div>
  );
}

StudyFilterModule.propTypes = {
  userType: PropTypes.string,
};

export default StudyFilterModule;
