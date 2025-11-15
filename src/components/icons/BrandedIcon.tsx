import React from 'react';
import { CloudProvider } from '../../types';
import { providerIcons } from '../Sidebar';
import { ShieldIcon } from './ShieldIcon';

interface BrandedIconProps {
  provider: CloudProvider;
  className?: string;
}

export const BrandedIcon: React.FC<BrandedIconProps> = ({ provider, className }) => {
  const Icon = providerIcons[provider] || ShieldIcon;

  return (
    <div className={`relative ${className}`}>
      <ShieldIcon className="absolute inset-0 w-full h-full text-brand-primary opacity-10" />
      <Icon className="relative w-full h-full p-1" />
    </div>
  );
};
