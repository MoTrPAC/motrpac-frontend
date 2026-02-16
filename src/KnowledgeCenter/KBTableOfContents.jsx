import React, { useEffect } from "react";
import tocbot from "tocbot";

/**
 * Right-side table of contents that auto-generates from document headings.
 * Uses tocbot for DOM-based heading extraction and scroll-spy.
 *
 * @param {string} contentKey - Changes when the document changes, triggering re-init.
 * @param {string} [contentSelector='.kb-document__body'] - CSS selector for the content area.
 */
function KBTableOfContents({
  contentKey,
  contentSelector = ".kb-document__body",
}) {
  useEffect(() => {
    // Short delay to ensure ReactMarkdown has rendered headings with IDs
    const timer = setTimeout(() => {
      tocbot.init({
        tocSelector: ".kb-toc__list",
        contentSelector,
        headingSelector: "h2, h3",
        ignoreSelector: ".kb-heading-anchor",
        orderedList: false,
        scrollSmooth: true,
        scrollSmoothOffset: -20,
        headingsOffset: 80,
        scrollSmoothDuration: 300,
        // Strip the anchor link text (e.g. trailing "#") from TOC entries
        headingLabelCallback: (text) => text.replace(/\s*#\s*$/, ""),
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      tocbot.destroy();
    };
  }, [contentKey, contentSelector]);

  return (
    <nav className="kb-toc" aria-label="Table of contents">
      <h3 className="kb-toc__heading">On this page</h3>
      <div className="kb-toc__list" />
    </nav>
  );
}

export default KBTableOfContents;
