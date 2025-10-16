import React, { useEffect, useState } from 'react';
import { getApiBase, extractResults, shouldSkipFetch } from './shared';

const Workouts = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/workouts/`;
    const mustInclude = "-8000.app.github.dev/api/workouts";
    if (!endpoint.includes(mustInclude)) {
      console.log(`Invalid API endpoint: ${endpoint}`);
    }
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
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Workouts</h2>
        <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#workoutModal">Add Workout</button>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="text-muted">No workouts found. Use "Add Workout" to create one.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">User</th>
                  <th scope="col">Title</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Performed At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((w) => (
                  <tr key={w.id || w._id || Math.random()}>
                    <td>{w.id || w._id}</td>
                    <td>{w.user}</td>
                    <td>{w.title}</td>
                    <td className="text-truncate" style={{maxWidth: '240px'}} title={w.notes}>{w.notes}</td>
                    <td>{w.performed_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Workout */}
      <div className="modal fade" id="workoutModal" tabIndex="-1" aria-labelledby="workoutModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="workoutModalLabel">Add Workout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">User</label>
                  <input type="text" className="form-control" placeholder="Username" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Workout title" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows="3" placeholder="Notes"></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Performed At</label>
                  <input type="datetime-local" className="form-control" />
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

export default Workouts;
