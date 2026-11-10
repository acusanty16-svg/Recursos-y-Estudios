import React from 'react';
import { motion } from 'framer-motion';

export default function LampBrandIcon({ variant = 'general', size = 'md', glowing = true }) {
  const dimensions = {
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size] || 'w-14 h-14';

  const isKids = variant === 'kids';

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions} select-none`}>
      {glowing && (
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: isKids ? [0.45, 0.75, 0.45] : [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none ${
            isKids ? 'bg-amber-400' : 'bg-amber-500/60'
          }`}
        />
      )}

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm"
      >
        {/* Halo de luz detrás de la llama */}
        <circle
          cx="86"
          cy="34"
          r={isKids ? '20' : '15'}
          fill="url(#flameGlow)"
          opacity="0.7"
        />

        {/* Llama animada en el pitorro de la lámpara */}
        <motion.g
          animate={{ y: [0, -2.5, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '86px', originY: '46px' }}
        >
          <path
            d="M86 14C86 14 99 28 99 38C99 45.1797 93.1797 51 86 51C78.8203 51 73 45.1797 73 38C73 28 86 14 86 14Z"
            fill="url(#flameOuter)"
          />
          <path
            d="M86 24C86 24 93 33 93 39C93 42.866 89.866 46 86 46C82.134 46 79 42.866 79 39C79 33 86 24 86 24Z"
            fill="#FEF08A"
          />
        </motion.g>

        {/* Asa posterior de la lámpara de aceite */}
        <path
          d="M28 62C17 62 12 53 15 45C18 37 28 40 31 48"
          stroke={isKids ? '#D97706' : '#B45309'}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Cuerpo principal de la lámpara bíblica */}
        <path
          d="M25 60C25 51 35 46 54 46C72 46 83 52 94 47C98 45 103 48 101 53C96 67 80 84 55 84C34 84 25 72 25 60Z"
          fill="url(#lampBody)"
          stroke={isKids ? '#92400E' : '#78350F'}
          strokeWidth="3.5"
        />

        {/* Base de la lámpara */}
        <path
          d="M40 85H70L75 93H35L40 85Z"
          fill="#B45309"
          stroke={isKids ? '#92400E' : '#78350F'}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Detalles expresivos exclusivos para el Modo Infantil */}
        {isKids ? (
          <g>
            {/* Ojos alegres del personaje Lámpara */}
            <circle cx="52" cy="63" r="4" fill="#451A03" />
            <circle cx="53.5" cy="61.5" r="1.4" fill="#FFFFFF" />
            <circle cx="68" cy="63" r="4" fill="#451A03" />
            <circle cx="69.5" cy="61.5" r="1.4" fill="#FFFFFF" />
            {/* Mejillas sonrojadas */}
            <ellipse cx="46" cy="67" rx="3.5" ry="2" fill="#FB7185" opacity="0.65" />
            <ellipse cx="74" cy="67" rx="3.5" ry="2" fill="#FB7185" opacity="0.65" />
            {/* Sonrisa tierna */}
            <path
              d="M56 68C58 71 62 71 64 68"
              stroke="#451A03"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </g>
        ) : (
          /* Grabado ornamental clásico para el Modo General */
          <path
            d="M38 64C48 69 65 69 78 61"
            stroke="#FEF3C7"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />
        )}

        <defs>
          <radialGradient id="flameGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(86 34) scale(20)">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flameOuter" x1="86" y1="14" x2="86" y2="51" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.55" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="lampBody" x1="25" y1="46" x2="95" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCD34D" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
