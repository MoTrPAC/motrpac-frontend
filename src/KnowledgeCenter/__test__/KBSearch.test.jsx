import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import KBSearch from '../KBSearch';

function renderSearch(searchResults) {
  const fuse = {
    search: vi.fn().mockReturnValue(searchResults),
  };
  const onSelect = vi.fn();

  render(<KBSearch fuse={fuse} onSelect={onSelect} />);

  return { fuse, onSelect };
}

function buildDoc(overrides = {}) {
  return {
    title: 'Default Title',
    category: 'project-overview',
    subcategory: null,
    slug: 'default-slug',
    content: 'Default content body for testing snippets.',
    ...overrides,
  };
}

describe('KBSearch snippet behavior', () => {
  test('shows content-centered snippet when content match exists', () => {
    const content = 'Alpha text before the exactMatchTerm appears and then more content follows.';
    const start = content.indexOf('exactMatchTerm');
    const end = start + 'exactMatchTerm'.length - 1;

    const result = {
      item: buildDoc({
        title: 'Content Match Doc',
        slug: 'content-match-doc',
        content,
      }),
      matches: [
        {
          key: 'content',
          value: content,
          indices: [[start, end]],
        },
      ],
    };

    const { fuse } = renderSearch([result]);

    fireEvent.change(screen.getByLabelText(/search documentation/i), {
      target: { value: 'exactMatchTerm' },
    });

    expect(fuse.search).toHaveBeenCalledWith('exactMatchTerm', { limit: 8 });

    const snippet = document.querySelector('.kb-search__result-snippet');
    expect(snippet).toBeInTheDocument();
    expect(snippet.textContent).toContain('exactMatchTerm');
  });

  test('uses title match for snippet when content match is unavailable', () => {
    const title = 'FAQ for Data Access';
    const start = title.indexOf('FAQ');

    const result = {
      item: buildDoc({
        title,
        slug: 'faq-data-access',
        content: 'Body text that does not contain the title keyword.',
      }),
      matches: [
        {
          key: 'title',
          value: title,
          indices: [[start, start + 2]],
        },
      ],
    };

    renderSearch([result]);

    fireEvent.change(screen.getByLabelText(/search documentation/i), {
      target: { value: 'FAQ' },
    });

    const snippet = document.querySelector('.kb-search__result-snippet');
    expect(snippet).toBeInTheDocument();
    expect(snippet.textContent).toContain('FAQ');
  });

  test('uses tags match for snippet when only tags match exists', () => {
    const tagValue = 'rna-seq';

    const result = {
      item: buildDoc({
        title: 'Transcriptomics Guide',
        slug: 'transcriptomics-guide',
        content: 'This body text is intentionally different.',
      }),
      matches: [
        {
          key: 'tags',
          value: tagValue,
          indices: [[0, tagValue.length - 1]],
        },
      ],
    };

    renderSearch([result]);

    fireEvent.change(screen.getByLabelText(/search documentation/i), {
      target: { value: 'rna-seq' },
    });

    const snippet = document.querySelector('.kb-search__result-snippet');
    expect(snippet).toBeInTheDocument();
    expect(snippet.textContent).toContain('rna-seq');
  });

  test('falls back to content prefix when match metadata is missing', () => {
    const content = 'Intro section starts here and provides context for the document.';

    const result = {
      item: buildDoc({
        title: 'No Match Metadata Doc',
        slug: 'no-match-metadata-doc',
        content,
      }),
      matches: [],
    };

    renderSearch([result]);

    fireEvent.change(screen.getByLabelText(/search documentation/i), {
      target: { value: 'intro' },
    });

    const snippet = document.querySelector('.kb-search__result-snippet');
    expect(snippet).toBeInTheDocument();
    expect(snippet.textContent).toContain('Intro section starts here');
  });

  test('keeps the literal query visible even when fuzzy indices are not centered on it', () => {
    const content =
      'Differential Analysis Compare groups of samples: Gene/protein/metabolite differential testing Multiple comparison correction';

    const result = {
      item: buildDoc({
        title: 'Differential Analysis',
        slug: 'differential-analysis',
        content,
      }),
      // Simulate fuzzy match metadata where first index is not near the literal "test"
      matches: [
        {
          key: 'content',
          value: content,
          indices: [[0, 1], [10, 10]],
        },
      ],
    };

    renderSearch([result]);

    fireEvent.change(screen.getByLabelText(/search documentation/i), {
      target: { value: 'test' },
    });

    const snippet = document.querySelector('.kb-search__result-snippet');
    expect(snippet).toBeInTheDocument();
    expect(snippet.textContent.toLowerCase()).toContain('test');
  });

  test('highlights matched query and does not render markdown syntax in snippet', () => {
    const content =
      'Differential **testing** and [test workflows](https://example.org) with `test` helpers.';

    const result = {
      item: buildDoc({
        title: 'Markdown Snippet Doc',
        slug: 'markdown-snippet-doc',
        content,
      }),
      matches: [
        {
          key: 'content',
          value: content,
          indices: [[0, 2]],
        },
      ],
    };

    renderSearch([result]);

    fireEvent.change(screen.getByLabelText(/search documentation/i), {
      target: { value: 'test' },
    });

    const snippet = document.querySelector('.kb-search__result-snippet');
    expect(snippet).toBeInTheDocument();

    const marks = snippet.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(0);
    expect(marks[0].textContent.toLowerCase()).toContain('test');

    // Ensure markdown syntax is stripped from rendered snippet text
    expect(snippet.textContent).not.toContain('**');
    expect(snippet.textContent).not.toContain('[');
    expect(snippet.textContent).not.toContain('](');
    expect(snippet.textContent).not.toContain('`');
  });
});
