import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import CompareViewer from "./components/CompareViewer";
import Results from "./components/Results";
import axios from "axios";

// --- Axios setup ---
axios.defaults.baseURL = "http://127.0.0.1:5000"; // Flask backend URL
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

function App() {
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [result, setResult] = useState(null);

  // Handle running change detection
  const handleRun = async (file1, file2) => {
    const form = new FormData();
    form.append("image1", file1);
    form.append("image2", file2);

    try {
      const res = await axios.post("/api/detect", form); // relative path works due to baseURL
      setResult(res.data);
      setImg1(URL.createObjectURL(file1));
      setImg2(URL.createObjectURL(file2));
    } catch (e) {
      console.error("Detection error:", e);
      alert(
        "Error running detection: " +
          (e.response?.data?.error || e.message || "Unknown error")
      );
    }
  };

  return (
    <div className="container">
      <h1>Deforestation Change Detection</h1>
      {/* Upload form component */}
      <UploadForm onRun={handleRun} />

      {/* Compare images if available */}
      {img1 && img2 && (
        <CompareViewer before={img1} after={img2} mask={result?.mask_url} />
      )}

      {/* Display results */}
      {result && <Results result={result} />}
    </div>
  );
}

export default App;
