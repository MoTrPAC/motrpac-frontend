export const tocbotConfig = {
  tocSelector: '.tocify', // Where to render the table of contents
  contentSelector: '.toc-content', // Where to grab the headings to build the table of contents
  headingSelector: 'h2, h3, h4', // Which headings to grab inside of the contentSelector element
  hasInnerContainers: true, // For headings inside relative or absolute positioned containers within content
  ignoreSelector: '.toc-ignore',
  headingsOffset: 100,
  scrollSmoothOffset: -100,
  tocScrollOffset: 100,
};

// fix toc position to the top of the page when scrolling
export function handleScroll() {
  const toc = document.getElementById('TOC');
  const tocBottom = toc.offsetTop + toc.offsetHeight;

  if (window.scrollY >= tocBottom) {
    toc.classList.add('toc-fix-top');
  }

  if (window.scrollY <= tocBottom) {
    toc.classList.remove('toc-fix-top');
  }
}
