import { describe, test, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../testUtils/test-utils';
import DataVizPage from '../dataVizPage';

// The real package is the whole visualization application — 2.5 MB of charts that
// wants a live API. Mock it and assert the contract instead: that this page hands
// it the API and asset bases. Getting those wrong is the failure that only shows
// up as empty plots in a deployed browser.
vi.mock('@motrpac/precawg-dataviz', () => ({
  PrecawgDataViz: ({ apiBase, assetBase }) => (
    <div data-testid="precawg-dataviz" data-api-base={apiBase} data-asset-base={assetBase} />
  ),
}));

describe('Data Visualization page', () => {
  test('Renders the page title', async () => {
    renderWithProviders(<DataVizPage />);
    expect(await screen.findByRole('heading', { name: 'Data Visualization' })).toBeInTheDocument();
  });

  test('Renders the embedded visualization application', async () => {
    renderWithProviders(<DataVizPage />);
    expect(await screen.findByTestId('precawg-dataviz')).toBeInTheDocument();
  });

  test('Passes the proxied API base and the asset base to the application', async () => {
    renderWithProviders(<DataVizPage />);
    const app = await screen.findByTestId('precawg-dataviz');
    // Defaults: the path this site's web server proxies to the PreCAWG FastAPI
    // service, and where this site serves the application's runtime assets.
    expect(app).toHaveAttribute('data-api-base', '/precawg');
    expect(app).toHaveAttribute('data-asset-base', '/precawg-embed');
  });

  test('Replaces the loading state once the lazy chunk resolves', async () => {
    renderWithProviders(<DataVizPage />);
    await waitFor(() => expect(screen.getByTestId('precawg-dataviz')).toBeInTheDocument());
    // Deliberately not asserting the fallback is visible first: with the module
    // mocked, the lazy import settles in a microtask, so observing the fallback
    // synchronously is a race. What matters is that it does not linger.
    expect(screen.queryByText(/Loading the visualization/i)).not.toBeInTheDocument();
  });
});
