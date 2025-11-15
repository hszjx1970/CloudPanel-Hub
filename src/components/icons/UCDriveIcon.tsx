import React from 'react';
export const UCDriveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill="#FF8B00" />
    <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="50" fill="white" textAnchor="middle" fontWeight="bold">UC</text>
  </svg>
);
