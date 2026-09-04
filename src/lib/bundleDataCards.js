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
    cohort: '6 month old',
    studyDesign: 'Endurance training',
    description:
      'Bundled downloads for young adult rats that completed the endurance training protocol. Each bundle packages one data type across all tissues.',
    datasets: () => BundleDataTypes.pass1b_06,
  },
  {
    code: 'rat-acute-06',
    name: 'Acute Exercise in Young Adult Rats',
    icon: 'pest_control_rodent',
    species: 'rat',
    cohort: '6 month old',
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
    cohort: 'Pre-Suspension',
    studyDesign: 'Acute exercise',
    description:
      'Bundled downloads for sedentary adults who performed a single endurance or resistance bout.',
    // Carried over from the tab this card replaced. Held here rather than in the
    // component so a second study can have its own notice without a special case.
    notice: {
      icon: 'bi-envelope-paper',
      before: 'Be sure to ',
      linkText: 'subscribe',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLScjGxwsHDDsE4P4j1VNvIUR73cEyh9SJrofxuQyHqucl0GhBg/viewform',
      after:
        ' to receive notifications about future data updates for the acute exercise in human sedentary adults study!',
    },
    datasets: (userType) =>
      userType === 'internal'
        ? BundleDataTypes.human_sed_adu_internal
        : BundleDataTypes.human_sed_adu_external,
  },
  {
    code: 'human-clinical',
    name: 'Phenotypic Data Across Human Cohorts',
    icon: 'person',
    species: 'human',
    description:
      'Bundled clinical and phenotypic data across the human cohorts, as shared at consortium release.',
    notice: {
      icon: 'bi-file-earmark-fill',
      before:
        'Learn more about the available clinical data in the ',
      linkText: 'Clinical Data Release Notes',
      href: 'https://docs.google.com/document/d/1cFPnB1cBKimUJo-5hwnq8yKDJ5DWgdDj4Y0pvl2UZYw/edit?tab=t.0#heading=h.7tm379xtz7sk',
    },
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
