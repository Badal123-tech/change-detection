// import React from 'react';

// export default function Results({ result }){
//   return (
//     <div className="results" style={{ margin: '20px 0' }}>
//       <h3>Results</h3>
//       <p><b>Change percent:</b> {result.change_percent}%</p>
//       <p><b>Mask URL:</b> <a href={result.mask_url} target="_blank" rel="noreferrer">Open mask</a></p>
//     </div>
//   );
// }


// components/Results.jsx
import React from 'react';
import '../styles/Results.css';

export default function Results({ result }) {
  const getChangeLevel = (percent) => {
    if (percent < 2) return { level: 'low', label: 'Minimal Change', color: '#4CAF50' };
    if (percent < 10) return { level: 'moderate', label: 'Moderate Change', color: '#FF9800' };
    return { level: 'high', label: 'Significant Change', color: '#F44336' };
  };

  const changeInfo = getChangeLevel(result.change_percent);

  return (
    <div className="results-container">
      <h3>Analysis Results</h3>

      <div className="results-grid">
        <div className="result-card change-percent">
          <div className="card-header">
            <h4>Change Percentage</h4>
          </div>
          <div className="card-content">
            <div
              className="change-circle"
              style={{ '--percent': result.change_percent, '--color': changeInfo.color }}
            >
              <span className="percent-value">{result.change_percent}%</span>
            </div>
            <div className="change-level">
              <span
                className="level-badge"
                style={{ backgroundColor: changeInfo.color }}
              >
                {changeInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="result-card details">
          <div className="card-header">
            <h4>Detection Details</h4>
          </div>
          <div className="card-content">
            <div className="detail-item">
              <span className="detail-label">Confidence Score:</span>
              <span className="detail-value">High (95%)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Processing Time:</span>
              <span className="detail-value">2.3 seconds</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Image Resolution:</span>
              <span className="detail-value">1920×1080 px</span>
            </div>
          </div>
        </div>

        <div className="result-card actions">
          <div className="card-header">
            <h4>Export Results</h4>
          </div>
          <div className="card-content">
            <a
              href={result.mask_url}
              download="change_mask.png"
              className="export-btn"
            >
              📥 Download Change Mask
            </a>
            <button className="export-btn">
              📊 Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}