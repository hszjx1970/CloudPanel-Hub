import React from 'react';

export const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M128 24C65.8 24 24 68.34 24 123.66C24 173.34 61.12 214.38 105.62 225.02C114.72 227.45 118.8 221.37 118.8 216.33V213.1C118.8 208.06 122.88 204.02 127.92 204.02H156.48C161.52 204.02 165.6 208.06 165.6 213.1V220.53C165.6 225.57 169.68 229.65 174.72 229.65C228.48 215.17 256 174.13 256 124.45C256 69.13 214.2 24.79 159 24.79" fill="currentColor" fillOpacity="0.8"/>
        <path d="M38.4 124.29C38.4 83.13 70.26 49.3 110.4 49.3H145.6C185.74 49.3 217.6 83.13 217.6 124.29C217.6 165.45 185.74 199.28 145.6 199.28H110.4C70.26 199.28 38.4 165.45 38.4 124.29Z" fill="white" fillOpacity="0.7"/>
        <path d="M128 78V170.58M128 78L106.5 99.5M128 78L149.5 99.5M128 170.58L106.5 149.08M128 170.58L149.5 149.08" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
