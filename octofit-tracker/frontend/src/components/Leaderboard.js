import React, { useEffect, useMemo, useState } from 'react';
import DetailModal from './DetailModal';
import { normalizeCollection } from '../utils/apiClient';

const resourceName = 'Leaderboard';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const endpoint = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceName) {
      const url = `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;
      console.log(`[${resourceName}] Endpoint resolved to: ${url}`);
      return url;
    }

    const fallbackUrl = '/api/leaderboard/';
    console.warn(
      `[${resourceName}] REACT_APP_CODESPACE_NAME not set; falling back to ${fallbackUrl}`
    );
    return fallbackUrl;
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
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
        setEntries(normalized);
      } catch (fetchError) {
        console.error(`[${resourceName}] Error fetching data`, fetchError);
        setError('Unable to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [endpoint]);

  const filteredEntries = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return entries;
    }

    return entries.filter((entry) =>
      [entry.user, entry.name, entry.team, entry.team_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(trimmed))
    );
  }, [entries, searchTerm]);

  return (
    <section className="mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="h4 mb-1 text-primary">Leaderboard</h2>
            <p className="text-muted small mb-0">Celebrate top performers and keep competition friendly.</p>
          </div>
          <form className="d-flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="leaderboard-search" className="visually-hidden">
              Search leaderboard
            </label>
            <input
              id="leaderboard-search"
              type="search"
              className="form-control"
              placeholder="Search athletes or teams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </form>
        </div>
        <div className="card-body">
          {loading && <p>Loading leaderboard...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Name</th>
                    <th scope="col">Points</th>
                    <th scope="col">Team</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan="5" className="table-no-data">
                        No leaderboard entries match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredEntries.map((entry, index) => {
                    const key = entry.id ?? `leaderboard-${entry.user ?? entry.name ?? index}`;
                    return (
                      <tr key={key}>
                        <td>{entry.rank ?? index + 1}</td>
                        <td>{entry.user || entry.name || 'Unknown athlete'}</td>
                        <td>{entry.points ?? entry.score ?? 0}</td>
                        <td>{entry.team || entry.team_name || 'Individual'}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setSelectedEntry(entry)}
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedEntry && (
        <DetailModal
          title={selectedEntry.user || selectedEntry.name || 'Leaderboard details'}
          onClose={() => setSelectedEntry(null)}
        >
          <dl className="row">
            <dt className="col-sm-4">Rank</dt>
            <dd className="col-sm-8">{selectedEntry.rank ?? 'Unranked'}</dd>
            <dt className="col-sm-4">Points</dt>
            <dd className="col-sm-8">{selectedEntry.points ?? selectedEntry.score ?? 0}</dd>
            <dt className="col-sm-4">Team</dt>
            <dd className="col-sm-8">{selectedEntry.team || selectedEntry.team_name || 'Individual'}</dd>
            <dt className="col-sm-4">Last activity</dt>
            <dd className="col-sm-8">{selectedEntry.last_activity || 'No recent activity logged.'}</dd>
          </dl>
        </DetailModal>
      )}
    </section>
  );
};

export default Leaderboard;
