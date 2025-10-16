import './App.css';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg bg-body-tertiary rounded shadow-sm mb-4">
        <div className="container-fluid">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <img src={`${process.env.PUBLIC_URL}/octofitapp-small.png`} alt="OctoFit" width="28" height="28" />
            <span className="fw-bold">OctoFit Tracker</span>
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} to="/activities">Activities</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} to="/leaderboard">Leaderboard</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} to="/teams">Teams</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} to="/users">Users</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} to="/workouts">Workouts</NavLink></li>
            </ul>
            <div className="d-flex">
              <a className="btn btn-outline-primary btn-sm" href="https://github.com/darkmusic/skills-build-applications-w-copilot-agent-mode" target="_blank" rel="noreferrer">View Repo</a>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/activities" replace />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="*" element={<div className="alert alert-warning">Page not found</div>} />
      </Routes>
    </div>
  );
}

export default App;
