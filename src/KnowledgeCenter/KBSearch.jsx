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

    if (!fuse) return;
    const searchResults = fuse.search(value.trim(), { limit: 8 });
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

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
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
  const getSnippet = (result, rawQuery) => {
    const SNIPPET_RADIUS = 60;
    const doc = result.item;
    const queryTerm = rawQuery?.trim().toLowerCase();

    const buildSnippetFromText = (text) => {
      if (!text) return "";

      const plain = stripMarkdown(text);
      if (!plain) return "";

      if (queryTerm && queryTerm.length >= 2) {
        const start = plain.toLowerCase().indexOf(queryTerm);
        if (start >= 0) {
          const end = start + queryTerm.length;
          const snippetStart = Math.max(0, start - SNIPPET_RADIUS);
          const snippetEnd = Math.min(plain.length, end + SNIPPET_RADIUS);
          const prefix = snippetStart > 0 ? "…" : "";
          const suffix = snippetEnd < plain.length ? "…" : "";
          return prefix + plain.slice(snippetStart, snippetEnd) + suffix;
        }
      }

      return plain.length > 120 ? plain.slice(0, 120) + "…" : plain;
    };

    const buildSnippetFromMatch = (match) => {
      if (!match || !match.indices || match.indices.length === 0) {
        return "";
      }

      const text = typeof match.value === "string"
        ? match.value
        : Array.isArray(match.value)
          ? match.value.join(" ")
          : "";

      if (!text) return "";

      const textSnippet = buildSnippetFromText(text);
      if (textSnippet) return textSnippet;

      const [start, end] = match.indices[0];
      const snippetStart = Math.max(0, start - SNIPPET_RADIUS);
      const snippetEnd = Math.min(text.length, end + 1 + SNIPPET_RADIUS);
      const prefix = snippetStart > 0 ? "…" : "";
      const suffix = snippetEnd < text.length ? "…" : "";
      const raw = text.slice(snippetStart, snippetEnd);

      return prefix + stripMarkdown(raw) + suffix;
    };

    // Prefer content snippet; fall back to first available matched key (e.g., title/tags)
    const matches = result.matches || [];
    const contentMatch = matches.find((m) => m.key === "content");
    if (contentMatch?.value) {
      const contentSnippet = buildSnippetFromText(contentMatch.value);
      if (contentSnippet) return contentSnippet;
    }

    const preferredMatch =
      matches.find((m) => m.key === "content" && m.indices?.length > 0) ||
      matches.find((m) => m.indices?.length > 0);

    const matchSnippet = buildSnippetFromMatch(preferredMatch);
    if (matchSnippet) {
      return matchSnippet;
    }

    // Fallback: beginning of content
    if (doc.content) {
      return buildSnippetFromText(doc.content);
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

  const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightSnippet = (snippet, rawQuery) => {
    const trimmedQuery = rawQuery?.trim();

    if (!snippet || !trimmedQuery || trimmedQuery.length < 2) {
      return snippet;
    }

    const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "ig");
    const parts = snippet.split(regex);
    const queryLower = trimmedQuery.toLowerCase();

    return parts.map((part, index) =>
      part.toLowerCase() === queryLower ? (
        <mark key={`snippet-mark-${index}`}>{part}</mark>
      ) : (
        <React.Fragment key={`snippet-text-${index}`}>{part}</React.Fragment>
      )
    );
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
      {query.trim().length > 0 && (
        <button
          type="button"
          className="kb-search__clear-btn"
          aria-label="Clear search"
          onClick={clearSearch}
        >
          ×
        </button>
      )}
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
                  {highlightSnippet(getSnippet(result, query), query)}
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
