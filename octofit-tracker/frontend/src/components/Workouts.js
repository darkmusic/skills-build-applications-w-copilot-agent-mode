import React, { useEffect, useState } from 'react';
import { getApiBase, extractResults, shouldSkipFetch } from './shared';

const Workouts = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/workouts/`;
    console.log('[Workouts] Fetching from:', endpoint);
    if (shouldSkipFetch()) {
      console.log('[Workouts] Skipping fetch in test mode:', endpoint);
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(endpoint)
      .then(async (res) => {
        const json = await res.json();
        console.log('[Workouts] Raw data:', json);
        return json;
      })
      .then((data) => setItems(extractResults(data)))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Workouts</h2>
      {items.length === 0 ? (
        <div className="text-muted">No workouts found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Title</th>
                <th>Notes</th>
                <th>Performed At</th>
              </tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.id || w._id || Math.random()}>
                  <td>{w.id || w._id}</td>
                  <td>{w.user}</td>
                  <td>{w.title}</td>
                  <td>{w.notes}</td>
                  <td>{w.performed_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Workouts;
