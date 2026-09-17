import BundleDataTypes from '../BrowseDataPage/components/bundleDataTypes';
import { visibleVersions } from './studyDataAccess';

/**
 * Pre-bundled datasets, grouped into cards.
 *
 * `bundleDataTypes.js` holds the datasets themselves; this describes the cards
 * they sit in, in the same shape the study collection cards use (code, name,
 * species, studyDesign, description) so both render with one visual language.
 *
 * Access is decided per collection, by the same `releaseStage` the study cards
 * use -- not by separate internal and external lists. A bundle with nothing
 * visible drops out, and a card with no visible bundles drops out with it, so a
 * consortium-only group is absent for external users rather than empty.
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
    datasets: () => BundleDataTypes.rat_training_06,
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
    datasets: () => BundleDataTypes.rat_acute_06,
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
    datasets: () => BundleDataTypes.human_precovid_sed_adu,
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
    datasets: () => BundleDataTypes.human_phenotype,
  },
];

/**
 * May this user download restricted bundles?
 *
 * Restricted bundles hold individual-level human data. The rule is signed-in
 * consortium members only -- an authenticated external user gets exactly what
 * an anonymous visitor gets. dbGaP-approved access may widen this later, but
 * there is no dbGaP entitlement on the profile, so it is not a case the app can
 * recognise; this function is the one place that would change.
 */
function mayAccessRestricted(userType) {
  return userType === 'internal';
}

/**
 * The file a collection offers this user.
 *
 * human-precovid-sed-adu splits each collection into restricted and
 * unrestricted builds of the same data -- the restricted one carries
 * individual-level results, the unrestricted one summary-level. They have
 * different sizes and different descriptions, so the choice decides what the
 * card says as well as what it downloads. Returns null when the user may have
 * neither, which drops the bundle rather than showing a download they cannot
 * take.
 */
function fileFor(collection, userType) {
  if (!collection.bundleVersions) {
    return { name: collection.name, size: collection.size, description: null };
  }
  const { restricted, unrestricted } = collection.bundleVersions;
  const chosen = mayAccessRestricted(userType) ? restricted || unrestricted : unrestricted;
  return chosen || null;
}

/**
 * Cards this user may see, each bundle carrying only the collections they may
 * download. Gating is per collection, so a bundle whose newer build is
 * consortium-only still offers its public one.
 */
export function visibleBundleCards(userType) {
  return bundleDataCards
    .map((card) => ({
      ...card,
      datasets: card
        .datasets()
        .map((bundle) => {
          const collections = visibleVersions(bundle.collections, userType)
            .map((collection) => {
              const file = fileFor(collection, userType);
              return file ? { ...collection, ...file } : null;
            })
            .filter(Boolean);
          return {
            ...bundle,
            collections,
            // A split bundle describes itself differently per audience.
            description: collections[0]?.description || bundle.description,
          };
        })
        .filter((bundle) => bundle.collections.length > 0),
    }))
    .filter((card) => card.datasets.length > 0);
}

/** Newest collection first, so the latest is what a card leads with. */
export function orderedCollections(bundle) {
  const collections = [...bundle.collections];
  const latestIndex = collections.findIndex((entry) => entry.latest);
  if (latestIndex > 0) {
    collections.unshift(collections.splice(latestIndex, 1)[0]);
  }
  return collections;
}

export default bundleDataCards;
