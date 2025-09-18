import React from 'react';

export default function Results({ result }){
  return (
    <div className="results">
      <h3>Results</h3>
      <p><b>Change percent:</b> {result.change_percent}%</p>
      <p><b>Mask URL:</b> <a href={result.mask_url} target="_blank" rel="noreferrer">Open mask</a></p>
    </div>
  );
}
