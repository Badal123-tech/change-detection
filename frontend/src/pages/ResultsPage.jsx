// pages/ResultsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CompareViewer from '../components/CompareViewer';
import Results from '../components/Results';
import '../styles/Results.css';

export default function ResultsPage({ result, img1, img2 }) {
  if (!result) {
    return (
      <div className="no-results">
        <div className="no-results-content">
          <h2>No Results Available</h2>
          <p>Please upload images first to see detection results.</p>
          <Link to="/upload" className="btn btn-primary">
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>Detection Results</h1>
        <p>Analysis of forest cover changes between the two images</p>
      </div>

      <div className="results-content">
        <div className="results-main">
          <div className="visualization-section">
            <CompareViewer
              before={img1}
              after={img2}
              mask={result.mask_url}
            />
          </div>

          <div className="analysis-section">
            <Results result={result} />
          </div>
        </div>

        <div className="results-actions">
          <Link to="/upload" className="btn btn-secondary">
            Analyze New Images
          </Link>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}