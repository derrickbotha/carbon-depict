// src/components/atoms/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = ({ className = 'h-4 bg-gray-200 rounded' }) => {
  return (
    <div className={`animate-skeletonPulse ${className}`} />
  );
};

export default SkeletonLoader;
