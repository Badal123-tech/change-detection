// components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            🌳 ForestGuard
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/upload"
              className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
            >
              Detect Changes
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/results"
              className={`nav-link ${location.pathname === '/results' ? 'active' : ''}`}
            >
              Results
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}