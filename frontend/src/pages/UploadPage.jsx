// pages/UploadPage.jsx
import React from 'react';
import UploadForm from '../components/UploadForm';
import '../styles/Upload.css';

export default function UploadPage({ onRun, loading }) {
  return (
    <div className="upload-page">
      <div className="page-header">
        <h1>Deforestation Change Detection</h1>
        <p>Upload satellite images to detect changes in forest cover</p>
      </div>

      <div className="upload-container">
        <UploadForm
          onRun={onRun}
          loading={loading}
        />
      </div>

      <div className="upload-info">
        <h3>📝 Upload Guidelines</h3>
        <ul>
          <li>Use high-resolution satellite images (JPEG, PNG, TIFF)</li>
          <li>Ensure images cover the same geographical area</li>
          <li>Optimal image size: 1000x1000 pixels to 4000x4000 pixels</li>
          <li>Maximum file size: 10MB per image</li>
          <li>For best results, use images taken under similar lighting conditions</li>
        </ul>
      </div>
    </div>
  );
}