import './App.css';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="container py-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 rounded">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">OctoFit Tracker</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/activities">Activities</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/leaderboard">Leaderboard</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/teams">Teams</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/users">Users</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/workouts">Workouts</NavLink></li>
            </ul>
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
