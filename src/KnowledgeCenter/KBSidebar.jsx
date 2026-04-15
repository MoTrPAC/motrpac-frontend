import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BASE_PATH = '/knowledge-center';

function KBSidebar({
  categories,
  documents,
  activeCategory = '',
  activeSubcategory = '',
  activeDoc = '',
  isOpen = false,
  onClose,
}) {
  // Track which categories and subcategories are expanded
  const [expandedKeys, setExpandedKeys] = useState(() => new Set());

  // Auto-expand active category/subcategory on route change
  useEffect(() => {
    if (activeCategory) {
      setExpandedKeys((prev) => {
        const next = new Set(prev);
        next.add(activeCategory);
        if (activeSubcategory) {
          next.add(`${activeCategory}/${activeSubcategory}`);
        }
        return next;
      });
    }
  }, [activeCategory, activeSubcategory]);

  const toggleExpand = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getDocsForCategory = (catSlug, subSlug = null) =>
    documents.filter(
      (d) => d.category === catSlug && d.subcategory === subSlug
    );

  const isActiveDoc = (docSlug, catSlug, subSlug = null) => {
    if (subSlug) {
      return (
        activeCategory === catSlug &&
        activeSubcategory === subSlug &&
        activeDoc === docSlug
      );
    }
    return (
      activeCategory === catSlug &&
      !activeSubcategory &&
      activeDoc === docSlug
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="kb-sidebar__overlay"
          onClick={onClose}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
        />
      )}
      <aside className={`kb-sidebar ${isOpen ? "kb-sidebar--open" : ""}`}>
        <nav>
          <ul className="kb-sidebar__list">
            {categories.map((cat) => {
              const isExpanded = expandedKeys.has(cat.slug);
              const catDocs = getDocsForCategory(cat.slug);
              const isActiveCat = activeCategory === cat.slug;

              return (
                <li key={cat.slug} className="kb-sidebar__category">
                  <div
                    className={`kb-sidebar__category-header ${
                      isActiveCat ? "kb-sidebar__category-header--active" : ""
                    }`}
                  >
                    <Link
                      to={`${BASE_PATH}/${cat.slug}`}
                      className="kb-sidebar__category-link"
                      onClick={onClose}
                    >
                      {cat.label}
                    </Link>
                    <button
                      className="kb-sidebar__toggle"
                      onClick={() => toggleExpand(cat.slug)}
                      aria-expanded={!!isExpanded}
                      aria-label={`Toggle ${cat.label}`}
                    >
                      <span
                        className={`kb-sidebar__chevron ${
                          isExpanded ? "kb-sidebar__chevron--open" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <ul className="kb-sidebar__docs">
                      {/* Category-level documents */}
                      {catDocs.map((doc) => (
                        <li
                          key={doc.slug}
                          className={`kb-sidebar__doc ${
                            isActiveDoc(doc.slug, cat.slug)
                              ? "kb-sidebar__doc--active"
                              : ""
                          }`}
                        >
                          <Link
                            to={`${BASE_PATH}/${cat.slug}/${doc.slug}`}
                            onClick={onClose}
                          >
                            {doc.title}
                          </Link>
                        </li>
                      ))}

                      {/* Subcategories */}
                      {cat.subcategories.map((sub) => {
                        const subKey = `${cat.slug}/${sub.slug}`;
                        const isSubExpanded = expandedKeys.has(subKey);
                        const subDocs = getDocsForCategory(
                          cat.slug,
                          sub.slug
                        );

                        return (
                          <li
                            key={sub.slug}
                            className="kb-sidebar__subcategory"
                          >
                            <div
                              className={`kb-sidebar__subcategory-header ${
                                activeSubcategory === sub.slug &&
                                isActiveCat
                                  ? "kb-sidebar__subcategory-header--active"
                                  : ""
                              }`}
                            >
                              <Link
                                to={`${BASE_PATH}/${cat.slug}/${sub.slug}`}
                                className="kb-sidebar__subcategory-link"
                                onClick={onClose}
                              >
                                {sub.label}
                              </Link>
                              {subDocs.length > 0 && (
                                <button
                                  className="kb-sidebar__toggle"
                                  onClick={() => toggleExpand(subKey)}
                                  aria-expanded={!!isSubExpanded}
                                  aria-label={`Toggle ${sub.label}`}
                                >
                                  <span
                                    className={`kb-sidebar__chevron ${
                                      isSubExpanded
                                        ? "kb-sidebar__chevron--open"
                                        : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {isSubExpanded && subDocs.length > 0 && (
                              <ul className="kb-sidebar__docs kb-sidebar__docs--nested">
                                {subDocs.map((doc) => (
                                  <li
                                    key={doc.slug}
                                    className={`kb-sidebar__doc ${
                                      isActiveDoc(
                                        doc.slug,
                                        cat.slug,
                                        sub.slug
                                      )
                                        ? "kb-sidebar__doc--active"
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      to={`${BASE_PATH}/${cat.slug}/${sub.slug}/${doc.slug}`}
                                      onClick={onClose}
                                    >
                                      {doc.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

KBSidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      subcategories: PropTypes.arrayOf(
        PropTypes.shape({
          slug: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      subcategory: PropTypes.string,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeCategory: PropTypes.string,
  activeSubcategory: PropTypes.string,
  activeDoc: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default KBSidebar;
