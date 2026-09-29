import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const AUTOLINK_OPTIONS = {
  behavior: 'append',
  properties: { className: ['kb-heading-anchor'], ariaHidden: true, tabIndex: -1 },
  content: {
    type: 'element',
    tagName: 'span',
    properties: { className: ['kb-heading-anchor__icon'] },
    children: [{ type: 'text', value: '#' }],
  },
};

function KBDocument({ title, content = '' }) {
  const { hash } = useLocation();

  // Scroll to the linked heading once the markdown is in the DOM.
  //
  // The browser resolves a fragment while parsing the document, which here is
  // before React has rendered any of this -- `rehype-slug` gives the headings
  // their ids, but not until the content mounts. Firefox re-attempts the scroll
  // as the page grows and so appeared to work; Chrome and Safari try once and
  // give up. In-app navigation to a hash was broken in all three, since no
  // document load happens at all.
  //
  // Above the early return: hooks run on every render, and a render that bails
  // out first would call fewer of them than the last one did.
  useEffect(() => {
    if (!hash) return;

    // `getElementById` rather than `querySelector`, so ids that are not valid
    // CSS selectors -- a leading digit, a dot from a version number -- still
    // resolve. Slugs here come from heading text and do contain both.
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
  }, [hash, content]);

  if (!content) {
    return (
      <div className="kb-document">
        <h2 className="kb-document__title">{title}</h2>
        <p className="text-muted">No content available for this section.</p>
      </div>
    );
  }

  return (
    <article className="kb-document">
      <div className="kb-document__body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, AUTOLINK_OPTIONS]]} disallowedElements={['iframe', 'script']}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}

KBDocument.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
};

export default KBDocument;
