import React, { useEffect, useMemo, useState } from 'react';
import DetailModal from './DetailModal';
import { normalizeCollection } from '../utils/apiClient';

const resourceName = 'Workouts';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const endpoint = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceName) {
      const url = `https://${codespaceName}-8000.app.github.dev/api/workouts/`;
      console.log(`[${resourceName}] Endpoint resolved to: ${url}`);
      return url;
    }

    const fallbackUrl = '/api/workouts/';
    console.warn(
      `[${resourceName}] REACT_APP_CODESPACE_NAME not set; falling back to ${fallbackUrl}`
    );
    return fallbackUrl;
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
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
        setWorkouts(normalized);
      } catch (fetchError) {
        console.error(`[${resourceName}] Error fetching data`, fetchError);
        setError('Unable to load workouts.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [endpoint]);

  const filteredWorkouts = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return workouts;
    }

    return workouts.filter((workout) =>
      [workout.title, workout.name, workout.focus, workout.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(trimmed))
    );
  }, [workouts, searchTerm]);

  return (
    <section className="mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="h4 mb-1 text-primary">Workouts</h2>
            <p className="text-muted small mb-0">Share curated workouts to keep athletes inspired.</p>
          </div>
          <form className="d-flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="workouts-search" className="visually-hidden">
              Search workouts
            </label>
            <input
              id="workouts-search"
              type="search"
              className="form-control"
              placeholder="Search workouts"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </form>
        </div>
        <div className="card-body">
          {loading && <p>Loading workouts...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Workout</th>
                    <th scope="col">Focus</th>
                    <th scope="col">Duration</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkouts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="table-no-data">
                        No workouts match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredWorkouts.map((workout, index) => (
                    <tr key={workout.id ?? `workout-${index}`}>
                      <td>
                        <div className="fw-semibold">
                          {workout.title || workout.name || `Workout #${index + 1}`}
                        </div>
                        <div className="small text-muted">
                          {workout.description?.slice(0, 120) || 'No description provided.'}
                        </div>
                      </td>
                      <td>{workout.focus || workout.category || 'General'}</td>
                      <td>{workout.duration || 'Not specified'}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedWorkout(workout)}
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
      {selectedWorkout && (
        <DetailModal
          title={selectedWorkout.title || selectedWorkout.name || 'Workout details'}
          onClose={() => setSelectedWorkout(null)}
        >
          <dl className="row">
            <dt className="col-sm-4">Focus</dt>
            <dd className="col-sm-8">{selectedWorkout.focus || selectedWorkout.category || 'General'}</dd>
            <dt className="col-sm-4">Duration</dt>
            <dd className="col-sm-8">{selectedWorkout.duration || 'Not specified'}</dd>
            <dt className="col-sm-4">Equipment</dt>
            <dd className="col-sm-8">{selectedWorkout.equipment || 'Bodyweight'}</dd>
            <dt className="col-sm-4">Description</dt>
            <dd className="col-sm-8">{selectedWorkout.description || 'No description provided.'}</dd>
          </dl>
        </DetailModal>
      )}
    </section>
  );
};

export default Workouts;
