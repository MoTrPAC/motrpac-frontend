import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function KBDocument({ title, content }) {
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
        <ReactMarkdown remarkPlugins={[remarkGfm]} disallowedElements={['img', 'iframe', 'script', 'comment']}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}

export default KBDocument;
