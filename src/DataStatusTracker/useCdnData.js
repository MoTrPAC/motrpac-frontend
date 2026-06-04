import { useState, useEffect } from 'react';

/**
 * Fetches a JSON array from a CDN URL.
 *
 * Returns `{ data, loading, error }`. The request is aborted on unmount and
 * the response is validated to be an array before being stored.
 */
export default function useCdnData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    // `no-cache` forces the browser to revalidate with the CDN (via ETag /
    // Last-Modified) on every load instead of serving a heuristically-cached
    // stale copy, so newly published data shows up without a hard refresh.
    fetch(url, { cache: 'no-cache', signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch data (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (!Array.isArray(json)) {
          throw new Error('Unexpected sample data tracker response format');
        }
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
