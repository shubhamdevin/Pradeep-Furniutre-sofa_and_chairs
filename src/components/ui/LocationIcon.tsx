import React from 'react';

interface LocationIconProps {
  className?: string;
  size?: number;
}

export default function LocationIcon({ className = 'w-3.5 h-3.5', size }: LocationIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="latestLocationPinGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA4335" />
          <stop offset="100%" stopColor="#C5221F" />
        </linearGradient>
        <filter id="locPinShadow" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Modern Google Maps style teardrop location pin */}
      <path
        d="M12 2C7.58 2 4 5.58 4 10C4 15.65 11.25 21.45 11.58 21.71C11.71 21.81 11.85 21.86 12 21.86C12.15 21.86 12.29 21.81 12.42 21.71C12.75 21.45 20 15.65 20 10C20 5.58 16.42 2 12 2Z"
        fill="url(#latestLocationPinGrad)"
      />
      {/* Inner white circle */}
      <circle cx="12" cy="9.6" r="3.2" fill="#FFFFFF" />
    </svg>
  );
}
