// components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Protect Our Forests with
            <span className="highlight"> AI-Powered Monitoring</span>
          </h1>
          <p className="hero-description">
            Detect deforestation changes automatically using satellite imagery and machine learning.
            Monitor forest health and track environmental changes in real-time.
          </p>
          <div className="hero-actions">
            <Link to="/upload" className="cta-button primary">
              Start Detection
            </Link>
            <Link to="/results" className="cta-button secondary">
              View Demo
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="forest-animation">
            <div className="tree"></div>
            <div className="tree"></div>
            <div className="tree"></div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📤</div>
            <h3>Upload Images</h3>
            <p>Upload before and after satellite images of forest areas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>AI Analysis</h3>
            <p>Our advanced algorithms detect changes and deforestation patterns</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Get Results</h3>
            <p>Receive detailed analysis with change percentages and visual masks</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">83%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1min</div>
            <div className="stat-label">Processing Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Forests Monitored</div>
          </div>
        </div>
      </section>
    </div>
  );
}