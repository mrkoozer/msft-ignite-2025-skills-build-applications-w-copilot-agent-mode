import React, { useEffect, useMemo, useState } from 'react';
import DetailModal from './DetailModal';
import { normalizeCollection } from '../utils/apiClient';

const resourceName = 'Teams';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const endpoint = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceName) {
      const url = `https://${codespaceName}-8000.app.github.dev/api/teams/`;
      console.log(`[${resourceName}] Endpoint resolved to: ${url}`);
      return url;
    }

    const fallbackUrl = '/api/teams/';
    console.warn(
      `[${resourceName}] REACT_APP_CODESPACE_NAME not set; falling back to ${fallbackUrl}`
    );
    return fallbackUrl;
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
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
        setTeams(normalized);
      } catch (fetchError) {
        console.error(`[${resourceName}] Error fetching data`, fetchError);
        setError('Unable to load teams data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [endpoint]);

  const filteredTeams = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return teams;
    }

    return teams.filter((team) =>
      [team.name, team.coach, team.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(trimmed))
    );
  }, [teams, searchTerm]);

  return (
    <section className="mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="h4 mb-1 text-primary">Teams</h2>
            <p className="text-muted small mb-0">Manage squads, coaches, and headcount with a unified view.</p>
          </div>
          <form className="d-flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="teams-search" className="visually-hidden">
              Search teams
            </label>
            <input
              id="teams-search"
              type="search"
              className="form-control"
              placeholder="Search teams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </form>
        </div>
        <div className="card-body">
          {loading && <p>Loading teams...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Team</th>
                    <th scope="col">Coach</th>
                    <th scope="col">Members</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.length === 0 && (
                    <tr>
                      <td colSpan="4" className="table-no-data">
                        No teams match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredTeams.map((team, index) => (
                    <tr key={team.id ?? `team-${team.name ?? index}`}>
                      <td>
                        <div className="fw-semibold">{team.name || 'Unnamed team'}</div>
                        <div className="small text-muted">{team.description || 'No description provided.'}</div>
                      </td>
                      <td>{team.coach || 'TBD'}</td>
                      <td>{team.members_count ?? team.members?.length ?? 0}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedTeam(team)}
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
      {selectedTeam && (
        <DetailModal title={selectedTeam.name || 'Team details'} onClose={() => setSelectedTeam(null)}>
          <dl className="row">
            <dt className="col-sm-4">Coach</dt>
            <dd className="col-sm-8">{selectedTeam.coach || 'TBD'}</dd>
            <dt className="col-sm-4">Members</dt>
            <dd className="col-sm-8">{selectedTeam.members_count ?? selectedTeam.members?.length ?? 0}</dd>
            <dt className="col-sm-4">Tagline</dt>
            <dd className="col-sm-8">{selectedTeam.tagline || 'No tagline provided.'}</dd>
            <dt className="col-sm-4">Description</dt>
            <dd className="col-sm-8">{selectedTeam.description || 'No description provided.'}</dd>
          </dl>
        </DetailModal>
      )}
    </section>
  );
};

export default Teams;
