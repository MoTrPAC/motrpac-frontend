import BundleDataTypes from '../BrowseDataPage/components/bundleDataTypes';

/**
 * Pre-bundled datasets, grouped into cards.
 *
 * `bundleDataTypes.js` holds the datasets themselves; this describes the cards
 * they sit in, in the same shape the study collection cards use (code, name,
 * species, studyDesign, description) so both render with one visual language.
 *
 * `datasets` is a function of userType because two groups differ by audience:
 * the human acute-exercise bundles have separate internal and external lists,
 * and two groups are internal-only. That gating is preserved exactly as it was
 * on the tab strip this replaced.
 */
const bundleDataCards = [
  {
    code: 'rat-training-06',
    name: 'Endurance Training in Young Adult Rats',
    icon: 'pest_control_rodent',
    species: 'rat',
    studyDesign: 'Endurance training',
    description:
      'Bundled downloads for young adult rats that completed the endurance training protocol. Each bundle packages one data type across all tissues.',
    datasets: () => BundleDataTypes.pass1b_06,
  },
  {
    code: 'rat-acute-06',
    name: 'Acute Exercise in Rats',
    icon: 'pest_control_rodent',
    species: 'rat',
    studyDesign: 'Acute exercise',
    description:
      'Bundled downloads for young adult rats that performed a single exercise bout.',
    internalOnly: true,
    datasets: () => BundleDataTypes.pass1a_06,
  },
  {
    code: 'human-precovid-sed-adu',
    name: 'Acute Exercise in Human Sedentary Adults',
    icon: 'person',
    species: 'human',
    studyDesign: 'Acute exercise',
    description:
      'Bundled downloads for sedentary adults who performed a single endurance or resistance bout.',
    datasets: (userType) =>
      userType === 'internal'
        ? BundleDataTypes.human_sed_adu_internal
        : BundleDataTypes.human_sed_adu_external,
  },
  {
    code: 'human-clinical',
    name: 'Clinical Data in Humans',
    icon: 'person',
    species: 'human',
    description:
      'Bundled clinical and phenotypic data across the human cohorts, as shared at consortium release.',
    internalOnly: true,
    datasets: () => BundleDataTypes.human_clinical_data_internal,
  },
];

/** Cards this user may see, each with its dataset list resolved. */
export function visibleBundleCards(userType) {
  return bundleDataCards
    .filter((card) => !card.internalOnly || userType === 'internal')
    .map((card) => ({ ...card, datasets: card.datasets(userType) || [] }))
    .filter((card) => card.datasets.length > 0);
}

export default bundleDataCards;
