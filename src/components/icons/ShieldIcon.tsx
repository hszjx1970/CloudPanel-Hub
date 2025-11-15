import React from 'react';

export const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.25C6.08 2.25 2.75 6.621 2.75 11.164c0 4.417 2.986 8.21 7.152 9.423a.75.75 0 00.392 0C14.464 19.374 17.45 15.58 17.45 11.164 17.45 6.62 14.12 2.25 8.2 2.25" fill="#0D6EFD"/>
        <path d="M12 3C6.48 3 2 7.48 2 13c0 4.05 2.57 7.42 6.22 8.57.34.11.71 0 .95-.27s.29-.66.13-.98c-.69-1.45-1.05-2.07-1.05-4.75C8.25 11.06 11.81 7.5 16.33 7.5c1.68 0 3.3.36 4.75 1.05.32.16.7.11.98-.13s.38-.61.27-.95C20.76 4.49 17.51 2.5 13.75 2.5 13.17 2.5 12.59 2.55 12.03 2.64" fill="white"/>
        <path d="M10 13h4M10 15h4" stroke="white" />
        <path d="M12 11v8m0-8l-2 2m2-2l2 2m-2 6l-2-2m2 2l2 2" stroke="white" />
    </svg>
);
