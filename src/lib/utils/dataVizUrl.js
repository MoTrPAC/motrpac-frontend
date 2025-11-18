// src/lib/utils/dataVizUrl.js
export function getDataVizURL(study = 'human-precovid') {
  // Get localStorage item
  const token = localStorage.getItem('ut');
  const dataVizHost =
    process.env.NODE_ENV !== 'production' ? 'data-viz-dev' : 'data-viz';
  if (study === 'rat-training-06') {
    return `https://${dataVizHost}.motrpac-data.org/`;
  }
  return `https://${dataVizHost}.motrpac-data.org/precawg/${token && token.length ? `?ut=${token}` : ''}`;
}
