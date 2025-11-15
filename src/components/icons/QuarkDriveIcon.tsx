import React from 'react';
export const QuarkDriveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill="#32D7C4" />
    <text x="50" y="68" fontFamily="sans-serif" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">夸克</text>
  </svg>
);