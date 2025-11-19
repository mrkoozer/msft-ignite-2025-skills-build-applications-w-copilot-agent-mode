import React, { useEffect, useMemo, useState } from 'react';
import DetailModal from './DetailModal';
import { normalizeCollection } from '../utils/apiClient';

const resourceName = 'Activities';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const endpoint = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceName) {
      const url = `https://${codespaceName}-8000.app.github.dev/api/activities/`;
      console.log(`[${resourceName}] Endpoint resolved to: ${url}`);
      return url;
    }

    const fallbackUrl = '/api/activities/';
    console.warn(
      `[${resourceName}] REACT_APP_CODESPACE_NAME not set; falling back to ${fallbackUrl}`
    );
    return fallbackUrl;
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
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
        setActivities(normalized);
      } catch (fetchError) {
        console.error(`[${resourceName}] Error fetching data`, fetchError);
        setError('Unable to load activities from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [endpoint]);

  const filteredActivities = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return activities;
    }

    return activities.filter((activity) =>
      Object.values(activity || {})
        .filter((value) => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(trimmed))
    );
  }, [activities, searchTerm]);

  return (
    <section className="mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="h4 mb-1 text-primary">Activities</h2>
            <p className="text-muted small mb-0">Review the most recent logged activities and drill into the details.</p>
          </div>
          <form className="d-flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="activities-search" className="visually-hidden">
              Search activities
            </label>
            <input
              id="activities-search"
              type="search"
              className="form-control"
              placeholder="Search activities"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </form>
        </div>
        <div className="card-body">
          {loading && <p>Loading activities...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Activity</th>
                    <th scope="col">When</th>
                    <th scope="col">Duration</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length === 0 && (
                    <tr>
                      <td colSpan="4" className="table-no-data">
                        No activities match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredActivities.map((activity, index) => {
                    const title = activity.name || activity.title || `Activity #${index + 1}`;
                    const subtitle = activity.date || activity.performed_at || 'No date provided';
                    return (
                      <tr key={activity.id ?? `${title}-${index}`}>
                        <td>
                          <div className="fw-semibold">{title}</div>
                          <div className="small text-muted">
                            {activity.description || activity.notes || 'No description provided.'}
                          </div>
                        </td>
                        <td>{subtitle}</td>
                        <td>{activity.duration || activity.length || 'Not set'}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedActivity(activity)}
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
      {selectedActivity && (
        <DetailModal
          title={selectedActivity.name || selectedActivity.title || 'Activity details'}
          onClose={() => setSelectedActivity(null)}
        >
          <dl className="row">
            <dt className="col-sm-4">Scheduled / Performed</dt>
            <dd className="col-sm-8">{selectedActivity.date || selectedActivity.performed_at || 'Not provided'}</dd>
            <dt className="col-sm-4">Duration</dt>
            <dd className="col-sm-8">{selectedActivity.duration || selectedActivity.length || 'Not provided'}</dd>
            <dt className="col-sm-4">Intensity</dt>
            <dd className="col-sm-8">{selectedActivity.intensity || selectedActivity.effort || 'Not provided'}</dd>
            <dt className="col-sm-4">Notes</dt>
            <dd className="col-sm-8">{selectedActivity.description || selectedActivity.notes || 'No additional notes.'}</dd>
          </dl>
        </DetailModal>
      )}
    </section>
  );
};

export default Activities;
