import React, { useEffect, useMemo, useState } from 'react';
import DetailModal from './DetailModal';
import { normalizeCollection } from '../utils/apiClient';

const resourceName = 'Users';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const endpoint = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceName) {
      const url = `https://${codespaceName}-8000.app.github.dev/api/users/`;
      console.log(`[${resourceName}] Endpoint resolved to: ${url}`);
      return url;
    }

    const fallbackUrl = '/api/users/';
    console.warn(
      `[${resourceName}] REACT_APP_CODESPACE_NAME not set; falling back to ${fallbackUrl}`
    );
    return fallbackUrl;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`[${resourceName}] Fetching data from ${endpoint}`);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const rawPayload = await response.json();
        console.log(`[${resourceName}] Raw payload:`, rawPayload);
        const normalized = normalizeCollection(rawPayload);
        console.log(`[${resourceName}] Normalized payload:`, normalized);
        setUsers(normalized);
      } catch (fetchError) {
        console.error(`[${resourceName}] Error fetching data`, fetchError);
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [endpoint]);

  const filteredUsers = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return users;
    }

    return users.filter((user) =>
      [user.username, user.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(trimmed))
    );
  }, [users, searchTerm]);

  return (
    <section className="mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="h4 mb-1 text-primary">Users</h2>
            <p className="text-muted small mb-0">Keep tabs on recently joined community members.</p>
          </div>
          <form className="d-flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="users-search" className="visually-hidden">
              Search users
            </label>
            <input
              id="users-search"
              type="search"
              className="form-control"
              placeholder="Search users"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </form>
        </div>
        <div className="card-body">
          {loading && <p>Loading users...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Email</th>
                    <th scope="col">Joined</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="table-no-data">
                        No users match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id ?? `user-${user.username ?? index}`}>
                      <td>
                        <div className="fw-semibold">{user.username || user.email || 'Anonymous user'}</div>
                        <div className="small text-muted">{user.role || 'Athlete'}</div>
                      </td>
                      <td>{user.email || 'No email listed'}</td>
                      <td>{user.joined_at || user.created_at || 'Unknown date'}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedUser && (
        <DetailModal title={selectedUser.username || selectedUser.email || 'User details'} onClose={() => setSelectedUser(null)}>
          <dl className="row">
            <dt className="col-sm-4">Email</dt>
            <dd className="col-sm-8">{selectedUser.email || 'No email listed'}</dd>
            <dt className="col-sm-4">Role</dt>
            <dd className="col-sm-8">{selectedUser.role || 'Athlete'}</dd>
            <dt className="col-sm-4">Joined</dt>
            <dd className="col-sm-8">{selectedUser.joined_at || selectedUser.created_at || 'Unknown date'}</dd>
            <dt className="col-sm-4">Status</dt>
            <dd className="col-sm-8">{selectedUser.status || 'Active'}</dd>
          </dl>
        </DetailModal>
      )}
    </section>
  );
};

export default Users;
