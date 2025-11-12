// components/UploadForm.jsx
import React, { useState } from 'react';
import '../styles/Upload.css';

export default function UploadForm({ onRun, loading }){
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [error, setError] = useState(null);

  const handleFile1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setF1(file);
      setPreview1(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleFile2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setF2(file);
      setPreview2(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleRun = async () => {
    if (!f1 || !f2) {
      setError('Please select both before and after images');
      return;
    }

    setError(null);

    try {
      await onRun(f1, f2);
      // Navigation happens in the parent component after successful detection
    } catch (err) {
      setError(err.message || 'Detection failed. Please try again.');
      console.error('Detection error:', err);
    }
  };

  const clearFiles = () => {
    setF1(null);
    setF2(null);
    setPreview1(null);
    setPreview2(null);
    setError(null);
  };

  return (
    <div className="upload-form-container">
      <div className="upload-form">
        <div className="file-inputs-container">
          {/* Before Image Upload */}
          <div className="file-input-group">
            <label className="file-input-label">
              <span className="label-text">Before Image</span>
              <span className="label-subtext">Original forest state</span>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={handleFile1Change}
                  accept="image/*"
                  disabled={loading}
                  className="file-input"
                />
                <div className="file-input-display">
                  {preview1 ? (
                    <img src={preview1} alt="Before preview" className="image-preview" />
                  ) : (
                    <div className="file-placeholder">
                      <span className="placeholder-icon">📷</span>
                      <span>Click to upload</span>
                    </div>
                  )}
                </div>
              </div>
              {f1 && (
                <div className="file-info">
                  <span className="file-name">{f1.name}</span>
                  <span className="file-size">
                    ({(f1.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* After Image Upload */}
          <div className="file-input-group">
            <label className="file-input-label">
              <span className="label-text">After Image</span>
              <span className="label-subtext">Current forest state</span>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={handleFile2Change}
                  accept="image/*"
                  disabled={loading}
                  className="file-input"
                />
                <div className="file-input-display">
                  {preview2 ? (
                    <img src={preview2} alt="After preview" className="image-preview" />
                  ) : (
                    <div className="file-placeholder">
                      <span className="placeholder-icon">📷</span>
                      <span>Click to upload</span>
                    </div>
                  )}
                </div>
              </div>
              {f2 && (
                <div className="file-info">
                  <span className="file-name">{f2.name}</span>
                  <span className="file-size">
                    ({(f2.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={clearFiles}
            disabled={loading}
            className="btn btn-secondary"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={!f1 || !f2 || loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing Images...
              </>
            ) : (
              'Detect Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}






// // components/UploadForm.jsx
// import React, { useState } from 'react';
// import '../styles/Upload.css';

// export default function UploadForm({ onRun }){
//   const [f1, setF1] = useState(null);
//   const [f2, setF2] = useState(null);
//   const [preview1, setPreview1] = useState(null);
//   const [preview2, setPreview2] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFile1Change = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setF1(file);
//       setPreview1(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const handleFile2Change = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setF2(file);
//       setPreview2(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const handleRun = async () => {
//     if (!f1 || !f2) {
//       setError('Please select both before and after images');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       await onRun(f1, f2);
//     } catch (err) {
//       setError('Detection failed. Please try again.');
//       console.error('Detection error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFiles = () => {
//     setF1(null);
//     setF2(null);
//     setPreview1(null);
//     setPreview2(null);
//     setError(null);
//   };

//   return (
//     <div className="upload-form-container">
//       <div className="upload-form">
//         <div className="file-inputs-container">
//           {/* Before Image Upload */}
//           <div className="file-input-group">
//             <label className="file-input-label">
//               <span className="label-text">Before Image</span>
//               <span className="label-subtext">Original forest state</span>
//               <div className="file-input-wrapper">
//                 <input
//                   type="file"
//                   onChange={handleFile1Change}
//                   accept="image/*"
//                   disabled={loading}
//                   className="file-input"
//                 />
//                 <div className="file-input-display">
//                   {preview1 ? (
//                     <img src={preview1} alt="Before preview" className="image-preview" />
//                   ) : (
//                     <div className="file-placeholder">
//                       <span className="placeholder-icon">📷</span>
//                       <span>Click to upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {f1 && (
//                 <div className="file-info">
//                   <span className="file-name">{f1.name}</span>
//                   <span className="file-size">
//                     ({(f1.size / 1024 / 1024).toFixed(2)} MB)
//                   </span>
//                 </div>
//               )}
//             </label>
//           </div>

//           {/* After Image Upload */}
//           <div className="file-input-group">
//             <label className="file-input-label">
//               <span className="label-text">After Image</span>
//               <span className="label-subtext">Current forest state</span>
//               <div className="file-input-wrapper">
//                 <input
//                   type="file"
//                   onChange={handleFile2Change}
//                   accept="image/*"
//                   disabled={loading}
//                   className="file-input"
//                 />
//                 <div className="file-input-display">
//                   {preview2 ? (
//                     <img src={preview2} alt="After preview" className="image-preview" />
//                   ) : (
//                     <div className="file-placeholder">
//                       <span className="placeholder-icon">📷</span>
//                       <span>Click to upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {f2 && (
//                 <div className="file-info">
//                   <span className="file-name">{f2.name}</span>
//                   <span className="file-size">
//                     ({(f2.size / 1024 / 1024).toFixed(2)} MB)
//                   </span>
//                 </div>
//               )}
//             </label>
//           </div>
//         </div>

//         {error && (
//           <div className="error-message">
//             ⚠️ {error}
//           </div>
//         )}

//         <div className="form-actions">
//           <button
//             type="button"
//             onClick={clearFiles}
//             disabled={loading}
//             className="btn btn-secondary"
//           >
//             Clear All
//           </button>
//           <button
//             type="button"
//             onClick={handleRun}
//             disabled={!f1 || !f2 || loading}
//             className="btn btn-primary"
//           >
//             {loading ? (
//               <>
//                 <span className="loading-spinner"></span>
//                 Analyzing Images...
//               </>
//             ) : (
//               'Detect Changes'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }