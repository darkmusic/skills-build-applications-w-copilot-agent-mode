import React, { useEffect, useState } from 'react';
import { getApiBase, extractResults, shouldSkipFetch } from './shared';

const Teams = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/teams/`;
    const mustInclude = "-8000.app.github.dev/api/teams";
    if (!endpoint.includes(mustInclude)) {
      console.log(`Invalid API endpoint: ${endpoint}`);
    }
    console.log('[Teams] Fetching from:', endpoint);
    if (shouldSkipFetch()) {
      console.log('[Teams] Skipping fetch in test mode:', endpoint);
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(endpoint)
      .then(async (res) => {
        const json = await res.json();
        console.log('[Teams] Raw data:', json);
        return json;
      })
      .then((data) => setItems(extractResults(data)))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Teams</h2>
        <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#teamModal">Create Team</button>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="text-muted">No teams found. Click "Create Team" to add one.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id || t._id || Math.random()}>
                    <td>{t.id || t._id}</td>
                    <td>{t.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Team */}
      <div className="modal fade" id="teamModal" tabIndex="-1" aria-labelledby="teamModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="teamModalLabel">Create Team</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Team Name</label>
                  <input type="text" className="form-control" placeholder="Enter team name" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
