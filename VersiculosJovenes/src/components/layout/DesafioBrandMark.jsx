import React from 'react';

export default function DesafioBrandMark({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Desafío 119:9"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="desafio1199-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#FF5D6C" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="#05070B"
        stroke="url(#desafio1199-ring)"
        strokeWidth="3.2"
      />
      {/* Destellos superiores bicolores */}
      <path d="M21 15 24 20" stroke="#22D3EE" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M32 12v6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M43 15 40 20" stroke="#FF5D6C" strokeWidth="2.4" strokeLinecap="round" />
      {/* Biblia abierta blanca */}
      <path
        d="M15 27c4.8-2.2 10-2.2 17 0v19c-7-2.2-12.2-2.2-17 0V27Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M49 27c-4.8-2.2-10-2.2-17 0v19c7-2.2 12.2-2.2 17 0V27Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M32 27v19" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
