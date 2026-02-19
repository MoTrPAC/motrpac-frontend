import React from 'react';
import PropTypes from 'prop-types';
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
