import React from 'react';

export default function CompareViewer({ before, after, mask }) {
  // simple side-by-side + overlay of mask
  return (
    <div className="compare">
      <div>
        <h4>Before</h4>
        <img src={before} alt="before" className="preview" />
      </div>
      <div>
        <h4>After</h4>
        <div style={{position:"relative", display:"inline-block"}}>
          <img src={after} alt="after" className="preview" />
           {mask && (
            <img
              src={mask}
              alt="mask"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.7, // so that the after image is partially visible through the mask
                pointerEvents: 'none' // so that it doesn't interfere with mouse events
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
