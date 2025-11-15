import React from 'react';

export const QRIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6.5-1.5l.707.707M12 10v4m0 4v1m-6.5-.5l-.707.707M6 11H4m16 0h-2M12 8V4m0 16v-4m6-12h-2M6 4H4m2 2v2M6 18H4m16 0h-2m-2-2v-2m-8 2H6m-2-2v-2m8-8V6M6 6h2M18 6h-2m-2 12h2m-8 0H8" />
    </svg>
);
