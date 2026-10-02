import React from 'react';

// Lightweight, GPU-friendly static paper background (Canvas animation disabled to prevent mobile GPU lag)
export const InkflowCanvas = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--paper)',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
