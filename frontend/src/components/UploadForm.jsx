import React, { useState } from 'react';

export default function UploadForm({ onRun }){
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  return (
    <div className="uploader">
      <label>Before image: <input type="file" onChange={e=>setF1(e.target.files[0])} accept="image/*" /></label>
      <label>After image: <input type="file" onChange={e=>setF2(e.target.files[0])} accept="image/*" /></label>
      <button disabled={!f1||!f2} onClick={()=>onRun(f1,f2)}>Run Change Detection</button>
    </div>
  );
}
