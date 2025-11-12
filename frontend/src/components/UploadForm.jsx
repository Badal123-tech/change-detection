// import React, { useState } from 'react';

// export default function UploadForm({ onRun }){
//   const [f1, setF1] = useState(null);
//   const [f2, setF2] = useState(null);
//   return (
//     <div className="uploader" style={{ margin: '20px 0' }}>
//       <label style={{ display: 'block', margin: '10px 0' }}>
//         Before image:
//         <input type="file" onChange={e=>setF1(e.target.files[0])} accept="image/*" />
//       </label>
//       <label style={{ display: 'block', margin: '10px 0' }}>
//         After image:
//         <input type="file" onChange={e=>setF2(e.target.files[0])} accept="image/*" />
//       </label>
//       <button
//         disabled={!f1||!f2}
//         onClick={()=>onRun(f1,f2)}
//         style={{
//           padding: '10px 20px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Run Change Detection
//       </button>
//     </div>
//   );
// }



// // components/UploadForm.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Upload.css';

// export default function UploadForm({ setDetectionResult, setUploadedImages }) {
//   const [files, setFiles] = useState({ file1: null, file2: null });
//   const [previews, setPreviews] = useState({ preview1: null, preview2: null });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleFileChange = (e, fileType) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file
//     if (!validateFile(file)) return;

//     setFiles(prev => ({ ...prev, [fileType]: file }));

//     // Create preview
//     const previewUrl = URL.createObjectURL(file);
//     setPreviews(prev => ({ ...prev, [fileType === 'file1' ? 'preview1' : 'preview2']: previewUrl }));
//     setError(null);
//   };

//   const validateFile = (file) => {
//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
//     const maxSize = 10 * 1024 * 1024; // 10MB

//     if (!validTypes.includes(file.type)) {
//       setError('Please upload JPEG, PNG, or TIFF images only');
//       return false;
//     }

//     if (file.size > maxSize) {
//       setError('File size must be less than 10MB');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!files.file1 || !files.file2) {
//       setError('Please select both before and after images');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("image1", files.file1);
//     formData.append("image2", files.file2);

//     try {
//       const response = await axios.post("/api/detect", formData);
//       setDetectionResult(response.data);
//       setUploadedImages({
//         img1: previews.preview1,
//         img2: previews.preview2
//       });

//       // Navigate to results page
//       navigate('/results');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Detection failed. Please try again.');
//       console.error('Detection error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFiles = () => {
//     setFiles({ file1: null, file2: null });
//     setPreviews({ preview1: null, preview2: null });
//     setError(null);
//   };

//   return (
//     <div className="upload-form-container">
//       <form onSubmit={handleSubmit} className="upload-form">
//         <div className="file-inputs-container">
//           {/* Before Image Upload */}
//           <div className="file-input-group">
//             <label className="file-input-label">
//               <span className="label-text">Before Image</span>
//               <span className="label-subtext">Original forest state</span>
//               <div className="file-input-wrapper">
//                 <input
//                   type="file"
//                   onChange={(e) => handleFileChange(e, 'file1')}
//                   accept="image/*"
//                   disabled={loading}
//                   className="file-input"
//                 />
//                 <div className="file-input-display">
//                   {previews.preview1 ? (
//                     <img src={previews.preview1} alt="Before preview" className="image-preview" />
//                   ) : (
//                     <div className="file-placeholder">
//                       <span className="placeholder-icon">📷</span>
//                       <span>Click to upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {files.file1 && (
//                 <div className="file-info">
//                   <span className="file-name">{files.file1.name}</span>
//                   <span className="file-size">
//                     ({(files.file1.size / 1024 / 1024).toFixed(2)} MB)
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
//                   onChange={(e) => handleFileChange(e, 'file2')}
//                   accept="image/*"
//                   disabled={loading}
//                   className="file-input"
//                 />
//                 <div className="file-input-display">
//                   {previews.preview2 ? (
//                     <img src={previews.preview2} alt="After preview" className="image-preview" />
//                   ) : (
//                     <div className="file-placeholder">
//                       <span className="placeholder-icon">📷</span>
//                       <span>Click to upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {files.file2 && (
//                 <div className="file-info">
//                   <span className="file-name">{files.file2.name}</span>
//                   <span className="file-size">
//                     ({(files.file2.size / 1024 / 1024).toFixed(2)} MB)
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
//             type="submit"
//             disabled={!files.file1 || !files.file2 || loading}
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
//       </form>
//     </div>
//   );
// }













// components/UploadForm.jsx
import React, { useState } from 'react';
import '../styles/Upload.css';

export default function UploadForm({ onRun }){
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    setError(null);

    try {
      await onRun(f1, f2);
    } catch (err) {
      setError('Detection failed. Please try again.');
      console.error('Detection error:', err);
    } finally {
      setLoading(false);
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