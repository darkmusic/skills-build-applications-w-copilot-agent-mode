import React, { useEffect, useState } from 'react';
import { getApiBase, extractResults, shouldSkipFetch } from './shared';

const Activities = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/activities/`;
    const mustInclude = "-8000.app.github.dev/api/activities";
    if (!endpoint.includes(mustInclude)) {
      console.log(`Invalid API endpoint: ${endpoint}`);
    }
    console.log('[Activities] Fetching from:', endpoint);
    if (shouldSkipFetch()) {
      console.log('[Activities] Skipping fetch in test mode:', endpoint);
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(endpoint)
      .then(async (res) => {
        const json = await res.json();
        console.log('[Activities] Raw data:', json);
        return json;
      })
      .then((data) => setItems(extractResults(data)))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
  <h2 className="h5 mb-0">Activities</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#activityModal">Add Activity</button>
          <a className="btn btn-outline-secondary btn-sm" href="#top">Back to top</a>
        </div>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="text-muted">No activities found. Click "Add Activity" to create one.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">User</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="text-end">Duration (min)</th>
                  <th scope="col" className="text-end">Distance (km)</th>
                  <th scope="col">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id || a._id || Math.random()}>
                    <td>{a.id || a._id}</td>
                    <td>{a.user}</td>
                    <td><span className="badge text-bg-info">{a.activity_type}</span></td>
                    <td className="text-end">{a.duration_minutes}</td>
                    <td className="text-end">{a.distance_km ?? '-'}</td>
                    <td>{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Activity */}
      <div className="modal fade" id="activityModal" tabIndex="-1" aria-labelledby="activityModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="activityModalLabel">Add Activity</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">User</label>
                  <input type="text" className="form-control" placeholder="Username" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select">
                    <option>Run</option>
                    <option>Ride</option>
                    <option>Walk</option>
                  </select>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Duration (min)</label>
                    <input type="number" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Distance (km)</label>
                    <input type="number" className="form-control" />
                  </div>
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

export default Activities;
