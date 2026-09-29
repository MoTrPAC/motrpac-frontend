import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import KBDocument from '../KBDocument';

const CONTENT = [
  '# Overview',
  '',
  'Intro text.',
  '',
  '## Data Processing and Analysis Framework',
  '',
  'Body text.',
].join('\n');

// jsdom has no layout, so it does not implement scrollIntoView. Spying on the
// prototype is what lets the assertion be "this element was scrolled to".
function renderAt(hash, content = CONTENT) {
  return render(
    <MemoryRouter initialEntries={[`/knowledge-center/a/b/doc${hash}`]}>
      <KBDocument title="Doc" content={content} />
    </MemoryRouter>
  );
}

describe('KBDocument - linking to a heading', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  test('scrolls to the heading named by the fragment', () => {
    // The reported bug: the browser resolves the fragment while parsing, before
    // React has rendered the markdown, so Chrome and Safari found nothing to
    // scroll to. Nothing in the app re-attempted it.
    const { container } = renderAt('#data-processing-and-analysis-framework');

    const heading = container.querySelector('#data-processing-and-analysis-framework');
    expect(heading, 'rehype-slug should have given the heading an id').not.toBeNull();
    expect(heading.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  test('does nothing without a fragment', () => {
    renderAt('');

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('does not throw when the fragment names nothing', () => {
    // A stale link, or an anchor into a section that has since been renamed.
    expect(() => renderAt('#no-such-heading')).not.toThrow();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('decodes a percent-encoded fragment', () => {
    // Headings with punctuation get encoded when the URL is shared.
    const { container } = renderAt('#caf%C3%A9-notes', '## Café Notes\n\nBody.');

    const heading = container.querySelector('h2[id]');
    expect(heading.id).toBe('café-notes');
    expect(heading.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  test('renders the empty state without calling hooks conditionally', () => {
    // The scroll effect sits above the `!content` early return; if it were
    // below, this render would call fewer hooks than one with content and React
    // would throw "Rendered fewer hooks than expected".
    const { rerender } = renderAt('#data-processing-and-analysis-framework');

    expect(() =>
      rerender(
        <MemoryRouter initialEntries={['/knowledge-center/a/b/doc#x']}>
          <KBDocument title="Doc" content="" />
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});
