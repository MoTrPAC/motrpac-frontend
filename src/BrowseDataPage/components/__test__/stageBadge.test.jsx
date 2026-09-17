import { describe, test, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import StageBadge from '../stageBadge';
import { STAGE_CODES, STAGE_LABELS } from '../../../lib/studyDataCards';

describe('StageBadge - rendering', () => {
  test('renders the code for a single stage', () => {
    const { container } = render(<StageBadge stage="early" />);
    expect(screen.getByText('EA')).toBeInTheDocument();
    expect(container.querySelector('.stage-badge-early')).toBeInTheDocument();
    expect(screen.getByTitle(/early access release/i)).toBeInTheDocument();
  });

  test('a collection released in stages shows both codes', () => {
    render(<StageBadge stage="consortium, early" />);
    expect(screen.getByText('CR / EA')).toBeInTheDocument();
    expect(screen.getByTitle(/varies by dataset/i)).toBeInTheDocument();
  });

  test('an unrecognised stage renders nothing rather than an empty pill', () => {
    const { container } = render(<StageBadge stage="not-a-stage" />);
    expect(container.querySelector('.stage-badge')).toBeNull();
  });
});

describe('StageBadge - every stage is styled', () => {
  // Adding a stage code without a matching style rule renders an unstyled pill
  // with no background and no border. That is how `early` shipped: EA was added
  // to STAGE_CODES but never to the stylesheet, so it was invisible as a badge.
  // Unit tests cannot see the stylesheet, so this reads it.
  const stylesheet = fs.readFileSync(
    path.join(process.cwd(), 'src/sass/browseData.scss'),
    'utf8'
  );

  test.each(Object.keys(STAGE_CODES))('%s has a stage-badge rule', (stage) => {
    expect(stylesheet).toContain(`&.stage-badge-${stage} {`);
  });

  test.each(Object.keys(STAGE_CODES))('%s rule declares a border', (stage) => {
    const rule = stylesheet.split(`&.stage-badge-${stage} {`)[1].split('}')[0];
    expect(rule).toMatch(/border:\s*1px solid/);
    expect(rule).toMatch(/background-color:/);
    expect(rule).toMatch(/color:/);
  });

  test('every stage code has a label for its hover text', () => {
    Object.keys(STAGE_CODES).forEach((stage) => {
      expect(STAGE_LABELS[stage]).toBeTruthy();
    });
  });
});
