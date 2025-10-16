import React, { useEffect, useState } from 'react';
import { getApiBase, extractResults, shouldSkipFetch } from './shared';

const Leaderboard = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/leaderboard/`;
    console.log('[Leaderboard] Fetching from:', endpoint);
    if (shouldSkipFetch()) {
      console.log('[Leaderboard] Skipping fetch in test mode:', endpoint);
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(endpoint)
      .then(async (res) => {
        const json = await res.json();
        console.log('[Leaderboard] Raw data:', json);
        return json;
      })
      .then((data) => setItems(extractResults(data)))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Leaderboard</h2>
        <a className="btn btn-outline-secondary btn-sm" href="#top">Back to top</a>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="text-muted">No leaderboard entries found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">User</th>
                  <th scope="col" className="text-end">Points</th>
                  <th scope="col" className="text-end">Rank</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id || e._id || Math.random()}>
                    <td>{e.id || e._id}</td>
                    <td>{e.user}</td>
                    <td className="text-end">{e.points}</td>
                    <td className="text-end">{e.rank ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
