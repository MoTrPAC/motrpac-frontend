import { describe, test, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../dashboard';
import { setReviewerAgreement } from '../../lib/userAccess';

const reviewer = {
  user_metadata: { userType: 'external', givenName: 'Test', hasAccess: true },
  app_metadata: { role: 'reviewer' },
};

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard
        profile={reviewer}
        isAuthenticated
        handleQCDataFetch={() => {}}
        lastModified=""
      />
    </MemoryRouter>
  );
}

describe('the reviewer R packages read as a dependency flow', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    setReviewerAgreement(true);
  });

  test('three tiers: repro, then the two R packages, then the two pipelines', () => {
    // Order is the assertion: repro builds what the two R packages carry, and
    // the two pipelines consume those, so the flow only means anything read
    // this way round. Matched on the headings, which are package names -- if
    // one is renamed this fails, and confirming the order still holds is the
    // right thing to be asked at that moment.
    const { container } = renderDashboard();
    const tiers = [...container.querySelectorAll('.package-flow-tier')];

    expect(tiers).toHaveLength(3);
    const titles = tiers.map((tier) =>
      [...tier.querySelectorAll('h3')].map((heading) => heading.textContent)
    );
    expect(titles).toEqual([
      ['motrpac-human-presuspension-repro'],
      ['MotrpacHumanPreSuspensionData', 'MotrpacHumanPreSuspensionAnalysis'],
      ['motrpac-human-presuspension-acute', 'motrpac-precovid-adult-sed-clinic-internal'],
    ]);
  });

  test('every package still offers its own download', () => {
    // The diagram must not have cost a button: these are the point of the page.
    const { container } = renderDashboard();

    container.querySelectorAll('.package-flow-node').forEach((node) => {
      expect(within(node).getByRole('button', { name: /download/i })).toBeInTheDocument();
    });
    expect(container.querySelectorAll('.package-flow-node')).toHaveLength(5);
  });

  test('every arrow into a tier hangs off that tier’s joining bar', () => {
    // Both connectors are bar-plus-legs, never a line running past the bar from
    // the box above: an arrow has to start where the two parents meet, or the
    // diagram says each box feeds only the one directly below it.
    const { container } = renderDashboard();

    container.querySelectorAll('.package-flow-link').forEach((link) => {
      expect(link.querySelector('.flow-bar')).not.toBeNull();
      expect(link.querySelectorAll('.flow-leg')).toHaveLength(2);
      expect(link.querySelector('.flow-leg-left')).not.toBeNull();
      expect(link.querySelector('.flow-leg-right')).not.toBeNull();
    });
  });

  test('the fan comes off one stem, the join off two risers', () => {
    const { container } = renderDashboard();
    const fan = container.querySelector('.package-flow-link-fan');
    const merge = container.querySelector('.package-flow-link-merge');

    // One parent above, so one line into the bar.
    expect(fan.querySelectorAll('.flow-stem')).toHaveLength(1);
    expect(fan.querySelectorAll('.flow-riser')).toHaveLength(0);

    // Two parents above, so one line from each into the bar.
    expect(merge.querySelectorAll('.flow-riser')).toHaveLength(2);
    expect(merge.querySelectorAll('.flow-stem')).toHaveLength(0);
  });

  test('the connectors are decoration, hidden from assistive technology', () => {
    // They carry no text, so a screen reader announcing them would read the
    // list as having empty items between the packages.
    const { container } = renderDashboard();
    const links = [...container.querySelectorAll('.package-flow-link')];

    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute('aria-hidden', 'true');
      expect(link.textContent).toBe('');
    });
  });

  test('declining the agreement disables every download in the flow', () => {
    setReviewerAgreement(false);
    const { container } = renderDashboard();

    const buttons = [...container.querySelectorAll('.package-flow-node')].map((node) =>
      within(node).getByRole('button', { name: /download/i })
    );
    expect(buttons).toHaveLength(5);
    buttons.forEach((button) => expect(button).toBeDisabled());
  });
});
