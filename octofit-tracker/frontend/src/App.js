import React, { useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navItems = [
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/teams', label: 'Teams' },
  { path: '/users', label: 'Users' },
  { path: '/workouts', label: 'Workouts' },
];

const logoSrc = `${process.env.PUBLIC_URL}/octofitapp-small.png`;

const NavigationMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const toggleNav = () => setExpanded((prev) => !prev);
  const closeNav = () => setExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg octofit-nav shadow-sm" aria-label="Primary navigation">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeNav}>
          <img src={logoSrc} alt="OctoFit Tracker logo" className="brand-logo" />
          <span className="fw-semibold">OctoFit Tracker</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="primary-nav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={toggleNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${expanded ? ' show' : ''}`} id="primary-nav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active fw-semibold' : ''}`
                  }
                  to={item.path}
                  onClick={closeNav}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const HeroBanner = () => (
  <section className="hero-banner py-5 mb-4">
    <div className="container">
      <div className="card hero-card border-0 shadow-sm">
        <div className="card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-4">
          <div>
            <p className="text-uppercase text-secondary fw-semibold small mb-2">Performance dashboard</p>
            <h1 className="display-6 fw-bold mb-3">Track activities, teams, and workouts in one place.</h1>
            <p className="text-muted mb-0">
              Stay on top of team progress, celebrate leaders, and guide athletes with curated workouts and detailed insights.
            </p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <NavLink className="btn btn-primary btn-lg" to="/activities">
              Explore Activities
            </NavLink>
            <NavLink className="btn btn-outline-secondary btn-lg" to="/leaderboard">
              View Leaderboard
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  </section>
);

function App() {
  return (
    <div className="app-shell min-vh-100">
      <NavigationMenu />
      <HeroBanner />
      <main className="container pb-5">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route
            path="*"
            element={<p className="text-center">That page was not found.</p>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
