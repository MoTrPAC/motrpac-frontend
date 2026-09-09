import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import actions from './browseDataActions';
import { entitledPrefixes } from '../lib/collectionFiles';
import { resolveScope, scopeStudies, scopeToPath } from '../lib/collectionScope';

/**
 * The file browser's collection selection, and the one way to change it.
 *
 * Both the Collection picker and the panel's "Reset filters" button change the
 * selection, so the dispatch/navigate/collapse rules live here rather than being
 * written twice.
 *
 * `entitled` is every collection this user may see; `available` is the subset
 * belonging to the studies currently in scope. The picker renders the first and
 * enables the second, so its buttons neither appear nor vanish as studies are
 * toggled.
 */
export default function useCollectionSelection(userType) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCollections = useSelector((state) => state.browseData.selectedCollections);

  const scope = resolveScope(location, userType);
  const { studyCodes, available } = scope;
  const entitled = entitledPrefixes(userType);
  const selected = selectedCollections.filter((prefix) => available.includes(prefix));

  function apply(next) {
    // An empty selection and a full one describe the same set, so collapse to
    // empty -- one state, one representation, one URL.
    const collapsed = next.length === available.length ? [] : next;
    const load = collapsed.length ? collapsed : available;
    dispatch(actions.selectCollections(load, collapsed));
    navigate(scopeToPath(scopeStudies(scope), collapsed));
  }

  function toggle(prefix) {
    apply(
      selected.includes(prefix)
        ? selected.filter((candidate) => candidate !== prefix)
        : [...selected, prefix]
    );
  }

  return {
    inFileBrowser: scope.inFileBrowser,
    studyCodes,
    available,
    entitled,
    selected,
    prefixes: scope.prefixes,
    apply,
    toggle,
  };
}
