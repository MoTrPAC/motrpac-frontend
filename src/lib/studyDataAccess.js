export function visibleVersions(versions, userType) {
  if (userType === 'internal') {
    return versions;
  }
  return versions.filter((version) => version.releaseStage === 'public');
}

export function hasVisibleCollections(study, userType) {
  return Object.values(study.dataTypes).some(
    (versions) => visibleVersions(versions, userType).length > 0
  );
}
