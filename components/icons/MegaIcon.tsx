
import React from 'react';
export const MegaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#D9272E" />
    <path d="M25,75 L25,35 C25,25 35,25 35,35 L35,40 L45,30 C50,25 50,25 55,30 L65,40 L65,35 C65,25 75,25 75,35 L75,75 L60,75 L60,50 L50,60 L40,50 L40,75 L25,75 Z" fill="white" />
  </svg>
);