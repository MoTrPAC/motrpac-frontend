import React, { useState, useRef, useEffect } from "react";

function KBSearch({ fuse, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.search(value, { limit: 8 });
    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
  };

  const handleSelect = (doc) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
    onSelect(doc);
  };

  /**
   * Strip markdown syntax to produce plain text for snippets.
   */
  const stripMarkdown = (text) =>
    text
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")   // images: ![alt](url) → alt
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")     // links: [text](url) → text
      .replace(/(`{1,3})[\s\S]*?\1/g, "")          // inline/fenced code
      .replace(/^#{1,6}\s+/gm, "")                 // headings
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1") // bold/italic
      .replace(/~~([^~]+)~~/g, "$1")               // strikethrough
      .replace(/^[>\-*+]\s+/gm, "")                // blockquotes, list markers
      .replace(/^\d+\.\s+/gm, "")                  // ordered list markers
      .replace(/\|/g, " ")                          // table pipes
      .replace(/^[-=]{3,}$/gm, "")                 // horizontal rules
      .replace(/\s+/g, " ")                         // collapse whitespace
      .trim();

  /**
   * Extract a short snippet around the first content match.
   * Falls back to the first ~120 chars of content if no content match.
   */
  const getSnippet = (result) => {
    const SNIPPET_RADIUS = 60;
    const doc = result.item;

    // Find the first match on the "content" key
    const contentMatch = result.matches?.find((m) => m.key === "content");
    if (contentMatch && contentMatch.indices.length > 0) {
      const [start] = contentMatch.indices[0];
      const text = contentMatch.value;
      const snippetStart = Math.max(0, start - SNIPPET_RADIUS);
      const snippetEnd = Math.min(text.length, start + SNIPPET_RADIUS);
      const prefix = snippetStart > 0 ? "…" : "";
      const suffix = snippetEnd < text.length ? "…" : "";
      const raw = text.slice(snippetStart, snippetEnd);
      return prefix + stripMarkdown(raw) + suffix;
    }

    // Fallback: beginning of content
    if (doc.content) {
      const plain = stripMarkdown(doc.content);
      return plain.length > 120 ? plain.slice(0, 120) + "…" : plain;
    }

    return "";
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelect(getDoc(results[activeIndex]));
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  const buildBreadcrumb = (doc) => {
    const parts = [doc.category];
    if (doc.subcategory) parts.push(doc.subcategory);
    return parts
      .map((p) =>
        p
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(" › ");
  };

  // Unwrap Fuse result to get the document item
  const getDoc = (result) => result.item;

  return (
    <div className="kb-search" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        className="form-control kb-search__input"
        placeholder="Search documentation..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        aria-label="Search documentation"
        aria-expanded={isOpen}
        role="combobox"
        aria-controls="kb-search-results"
        aria-activedescendant={
          activeIndex >= 0 ? `kb-search-result-${activeIndex}` : undefined
        }
      />
      {isOpen && (
        <ul
          id="kb-search-results"
          className="kb-search__results"
          role="listbox"
        >
          {results.map((result, idx) => {
            const doc = getDoc(result);
            return (
              <li
                key={`${doc.category}-${doc.subcategory}-${doc.slug}`}
                id={`kb-search-result-${idx}`}
                className={`kb-search__result ${
                  idx === activeIndex ? "kb-search__result--active" : ""
                }`}
                role="option"
                aria-selected={idx === activeIndex}
                onClick={() => handleSelect(doc)}
              >
                <span className="kb-search__result-title">{doc.title}</span>
                <span className="kb-search__result-snippet">
                  {getSnippet(result)}
                </span>
                <span className="kb-search__result-breadcrumb">
                  {buildBreadcrumb(doc)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default KBSearch;
