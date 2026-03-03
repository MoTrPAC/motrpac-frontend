// src/lib/utils/dataVizUrl.js
export function getDataVizURL(study = 'human-precovid', userType = '') {
  // Get localStorage item
  const token = localStorage.getItem('ut');
  const dataVizHost = import.meta.env.VITE_DATA_VIZ_HOST;
  if (study === 'rat-training-06') {
    return dataVizHost;
  }
  return `${dataVizHost}precawg/${userType && userType === 'internal' && token && token.length ? `?ut=${token}` : ''}`;
}
