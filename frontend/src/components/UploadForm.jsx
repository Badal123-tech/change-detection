import React, { useState } from 'react';

export default function UploadForm({ onRun }){
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  return (
    <div className="uploader" style={{ margin: '20px 0' }}>
      <label style={{ display: 'block', margin: '10px 0' }}>
        Before image:
        <input type="file" onChange={e=>setF1(e.target.files[0])} accept="image/*" />
      </label>
      <label style={{ display: 'block', margin: '10px 0' }}>
        After image:
        <input type="file" onChange={e=>setF2(e.target.files[0])} accept="image/*" />
      </label>
      <button
        disabled={!f1||!f2}
        onClick={()=>onRun(f1,f2)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Run Change Detection
      </button>
    </div>
  );
}