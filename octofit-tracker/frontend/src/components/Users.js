import React, { useEffect, useState } from 'react';
import { getApiBase, extractResults, shouldSkipFetch } from './shared';

const Users = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/users/`;
    const mustInclude = "-8000.app.github.dev/api/users";
    if (!endpoint.includes(mustInclude)) {
      console.log(`Invalid API endpoint: ${endpoint}`);
    }
    console.log('[Users] Fetching from:', endpoint);
    if (shouldSkipFetch()) {
      console.log('[Users] Skipping fetch in test mode:', endpoint);
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(endpoint)
      .then(async (res) => {
        const json = await res.json();
        console.log('[Users] Raw data:', json);
        return json;
      })
      .then((data) => setItems(extractResults(data)))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 className="h5 mb-0">Users</h2>
        <form className="d-flex" role="search" onSubmit={(e)=>e.preventDefault()}>
          <input className="form-control form-control-sm me-2" type="search" placeholder="Search users" aria-label="Search" />
          <button className="btn btn-outline-success btn-sm" type="submit">Search</button>
        </form>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="text-muted">No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Team</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id || u._id || Math.random()}>
                    <td>{u.id || u._id}</td>
                    <td>
                      <a className="link-primary" href={`#/users/${u.id || u._id}`}>{u.name}</a>
                    </td>
                    <td><a className="link-secondary" href={`mailto:${u.email}`}>{u.email}</a></td>
                    <td>{u.team ?? '-'}</td>
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

export default Users;
