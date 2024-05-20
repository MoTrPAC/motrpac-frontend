export const tocbotConfig = {
  tocSelector: '.tocify', // Where to render the table of contents
  contentSelector: '.toc-content', // Where to grab the headings to build the table of contents
  headingSelector: 'h2, h3, h4', // Which headings to grab inside of the contentSelector element
  hasInnerContainers: true, // For headings inside relative or absolute positioned containers within content
  ignoreSelector: '.toc-ignore',
  headingsOffset: 100,
  scrollSmoothOffset: -100,
};

export const pass1b06GraphicalClusteringLandscapeImageLocation =
  'https://cdn.motrpac-data.org/assets/datahub/graphical_clustering_results/figures/pass1b_06/landscape';

export const pass1b06GraphicalClusteringMitoImageLocation =
  'https://cdn.motrpac-data.org/assets/datahub/graphical_clustering_results/figures/pass1b_06/mitochondria';

// fix toc position to the top of the page when scrolling
export function handleScroll() {
  // page elements to compute total offset height
  // to fix toc to the top of the page when scrolling
  const pageHeader = document.querySelector('.page-header');
  const summary = document.querySelector('.page-summary');
  const intro = document.getElementById('introduction');
  const control = document.querySelector('.controlPanelContainer');
  // current scroll height of the page
  const scrollHeight =
    window.scrollY ||
    document.body.scrollTop ||
    (document.documentElement && document.documentElement.scrollTop);
  // conditions required to fix toc to the top of the page
  const page = document.querySelector('.graphicalClusteringPage');
  const toc = document.getElementById('TOC');

  if (page && toc) {
    const offsetHeight =
      pageHeader.offsetHeight + summary.offsetHeight + intro.offsetHeight + 50;

    if (scrollHeight >= offsetHeight) {
      control.classList.add('controlPanelContainer-fix-top');
      toc.classList.add('toc-fix-top');
    } else {
      control.classList.remove('controlPanelContainer-fix-top');
      toc.classList.remove('toc-fix-top');
    }
  }
}
