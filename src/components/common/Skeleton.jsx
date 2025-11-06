import React from 'react';

/**
 * Skeleton Component
 * 로딩 중 표시되는 스켈레톤 UI
 */
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default Skeleton;
