// import React from 'react';

// export default function CompareViewer({ before, after, mask }) {
//   // simple side-by-side + overlay of mask
//   return (
//     <div className="compare">
//       <div>
//         <h4>Before</h4>
//         <img src={before} alt="before" className="preview" />
//       </div>
//       <div>
//         <h4>After</h4>
//         <div style={{position:"relative", display:"inline-block"}}>
//           <img src={after} alt="after" className="preview" />
//            {mask && (
//             <img
//               src={mask}
//               alt="mask"
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 opacity: 0.7, // so that the after image is partially visible through the mask
//                 pointerEvents: 'none' // so that it doesn't interfere with mouse events
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


// // components/CompareViewer.jsx
// import React, { useState } from 'react';
// import '../styles/CompareViewer.css';

// export default function CompareViewer({ before, after, mask }) {
//   const [sliderPosition, setSliderPosition] = useState(50);

//   return (
//     <div className="compare-viewer">
//       <div className="viewer-header">
//         <h3>Image Comparison</h3>
//         <div className="viewer-controls">
//           <span>Before</span>
//           <span>After</span>
//         </div>
//       </div>

//       <div className="comparison-container">
//         <div className="image-comparison-wrapper">
//           {/* Before Image */}
//           <div className="image-container before-image">
//             <img src={before} alt="Before deforestation" />
//             <div className="image-label">Before</div>
//           </div>

//           {/* After Image with Mask Overlay */}
//           <div className="image-container after-image">
//             <img src={after} alt="After deforestation" />
//             {mask && (
//               <div
//                 className="mask-overlay"
//                 style={{
//                   backgroundImage: `url(${mask})`,
//                   mixBlendMode: 'multiply'
//                 }}
//               />
//             )}
//             <div className="image-label">After with Change Detection</div>
//           </div>
//         </div>

//         {mask && (
//           <div className="mask-legend">
//             <div className="legend-item">
//               <div className="legend-color change-area"></div>
//               <span>Detected Changes (Deforestation)</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }














// components/CompareViewer.jsx (Enhanced)
import React, { useState, useRef, useEffect } from 'react';
import '../styles/CompareViewer.css';

export default function CompareViewer({ before, after, mask }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateSliderPosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setSliderPosition(clampedPercentage);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="compare-viewer">
      <div className="viewer-header">
        <h3>Image Comparison</h3>
        <div className="viewer-controls">
          <span>Before</span>
          <span>After</span>
        </div>
      </div>

      <div className="comparison-container">
        {/* Interactive Slider View */}
        <div
          className="comparison-slider"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="slider-before">
            <img src={before} alt="Before deforestation" />
          </div>
          <div
            className="slider-after"
            style={{ width: `${sliderPosition}%` }}
          >
            <img src={after} alt="After deforestation" />
            {mask && (
              <div
                className="mask-overlay"
                style={{ backgroundImage: `url(${mask})` }}
              />
            )}
          </div>
          <div
            className="slider-handle"
            style={{ left: `${sliderPosition}%` }}
          />
        </div>

        {mask && (
          <div className="mask-legend">
            <div className="legend-item">
              <div className="legend-color change-area"></div>
              <span>Detected Changes (Deforestation)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}