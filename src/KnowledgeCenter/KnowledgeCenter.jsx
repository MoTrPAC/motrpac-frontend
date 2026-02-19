import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Helmet } from 'react-helmet';
import knowledgeBase from '../data/knowledge-base.json';
import KBSidebar from './KBSidebar';
import KBDocument from './KBDocument';
import KBTableOfContents from './KBTableOfContents';
import KBSearch from './KBSearch';

import '@styles/knowledgeCenter.scss';

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 2 },
    { name: "tags", weight: 1.5 },
    { name: "content", weight: 1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

function KnowledgeCenter() {
  const { "*": splat = "" } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathSegments = useMemo(
    () => splat.split("/").filter(Boolean),
    [splat]
  );

  const category = pathSegments[0] || null;
  const subcategoryOrDoc = pathSegments[1] || null;
  const doc = pathSegments[2] || null;

  const { categories, documents, rootIndexContent } = knowledgeBase;

  // Build fuse search index
  const fuse = useMemo(
    () => new Fuse(documents, FUSE_OPTIONS),
    [documents]
  );

  // Determine what content to display based on route params
  const activeContent = useMemo(() => {
    // No params — root index
    if (!category) {
      return {
        type: "index",
        title: "Knowledge Center",
        content: rootIndexContent,
      };
    }

    const cat = categories.find((c) => c.slug === category);
    if (!cat) return { type: "not-found" };

    // Only category in URL
    if (!subcategoryOrDoc) {
      return {
        type: "category-index",
        title: cat.label,
        content: cat.indexContent,
        category: cat,
      };
    }

    // Check if subcategoryOrDoc is a subcategory or a document
    const sub = cat.subcategories.find((s) => s.slug === subcategoryOrDoc);

    if (sub && !doc) {
      // It's a subcategory landing — if no index content, redirect to first child doc
      if (!sub.indexContent) {
        const firstDoc = documents.find(
          (d) => d.category === category && d.subcategory === subcategoryOrDoc
        );
        if (firstDoc) {
          return {
            type: "subcategory-redirect",
            redirectTo: `/knowledge-center/${category}/${subcategoryOrDoc}/${firstDoc.slug}`,
          };
        }

        return {
          type: "subcategory-empty",
          title: sub.label,
          category: cat,
          subcategory: sub,
        };
      }
      return {
        type: "subcategory-index",
        title: sub.label,
        content: sub.indexContent,
        category: cat,
        subcategory: sub,
      };
    }

    if (sub && doc) {
      // Subcategory document
      const document = documents.find(
        (d) =>
          d.category === category &&
          d.subcategory === subcategoryOrDoc &&
          d.slug === doc
      );
      if (!document) return { type: "not-found" };
      return { type: "document", ...document };
    }

    // subcategoryOrDoc is a document slug (no subcategory)
    const document = documents.find(
      (d) =>
        d.category === category &&
        !d.subcategory &&
        d.slug === subcategoryOrDoc
    );
    if (!document) return { type: "not-found" };
    return { type: "document", ...document };
  }, [category, subcategoryOrDoc, doc, categories, documents, rootIndexContent]);

  const activeSubcategory = useMemo(() => {
    if (activeContent.type === "subcategory-index") {
      return activeContent.subcategory?.slug || null;
    }

    if (activeContent.type === "document") {
      return activeContent.subcategory || null;
    }

    return null;
  }, [activeContent]);

  const handleSearchSelect = (document) => {
    const path = document.subcategory
      ? `/knowledge-center/${document.category}/${document.subcategory}/${document.slug}`
      : `/knowledge-center/${document.category}/${document.slug}`;
    navigate(path);
  };

  return (
    <div className="knowledgeCenterPage knowledge-center px-3 px-md-4 mb-3 container-fluid">
      <Helmet>
        <html lang="en" />
        <title>MoTrPAC Knowledge Center - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <div className="page-title">
          <h1 className="mb-0">Knowledge Center</h1>
          <button
            className="btn btn-secondary d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </div>
      <div className="knowledge-center__header d-flex justify-content-end align-items-center">
        <KBSearch fuse={fuse} onSelect={handleSearchSelect} />
      </div>
      <div className="knowledge-center__body">
        <KBSidebar
          categories={categories}
          documents={documents}
          activeCategory={category}
          activeSubcategory={activeSubcategory}
          activeDoc={doc || subcategoryOrDoc}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="knowledge-center__content">
          {activeContent.type === "subcategory-redirect" ? (
            <Navigate to={activeContent.redirectTo} replace />
          ) : activeContent.type === "subcategory-empty" ? (
            <div className="text-center py-5">
              <h2>{activeContent.title}</h2>
              <p>No documentation pages are currently available in this section.</p>
            </div>
          ) : activeContent.type === "not-found" ? (
            <div className="text-center py-5">
              <h2>Page not found</h2>
              <p>The requested documentation page could not be found.</p>
            </div>
          ) : (
            <KBDocument
              title={activeContent.title}
              content={activeContent.content}
            />
          )}
        </main>
        {activeContent.type === "document" && (
          <KBTableOfContents contentKey={activeContent.slug} />
        )}
      </div>
    </div>
  );
}

export default KnowledgeCenter;
