import { describe, test, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { normalizeContent } from '../../../scripts/fetch-docs';
import KBDocument from '../KBDocument';

/** How many line breaks the Knowledge Center actually renders for this markdown. */
function renderedBreaks(markdown) {
  const { container } = render(
    <MemoryRouter>
      <KBDocument title="t" content={markdown} />
    </MemoryRouter>
  );
  return container.querySelectorAll('br').length;
}

describe('fetch-docs keeps markdown hard line breaks', () => {
  const AUTHORED = [
    '**Data collection type:** analysis  ',
    '**Levels included:** Levels 2–4 (analysis results)  ',
    '**Next anticipated release:** 2026-09-24',
  ].join('\n');

  test('three label lines survive the fetch as three lines', () => {
    // They arrived as one. Two trailing spaces are CommonMark's hard break, and
    // trimming trailing whitespace on every line removed them, so the three
    // lines collapsed into a single paragraph.
    expect(renderedBreaks(AUTHORED)).toBe(2);
    expect(renderedBreaks(normalizeContent(AUTHORED, 'a/b/doc.md'))).toBe(2);
  });

  test('a run of trailing spaces normalises to exactly two', () => {
    expect(normalizeContent('a     \nb', 'doc.md')).toBe('a  \nb');
  });

  test('a single trailing space or tab is still removed', () => {
    // The tidying the rule was written for, which still holds.
    expect(normalizeContent('a \nb', 'doc.md')).toBe('a\nb');
    expect(normalizeContent('a\t\nb', 'doc.md')).toBe('a\nb');
  });

  test('a whitespace-only line does not become a break', () => {
    expect(normalizeContent('a\n   \nb', 'doc.md')).toBe('a\n\nb');
  });
});
