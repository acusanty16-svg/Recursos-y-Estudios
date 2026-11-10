import React from 'react';
import { motion } from 'framer-motion';

// Ilustraciones vectoriales propias para cada escena bíblica infantil
export default function KidsIllustrations({ scene = 'lamp', className = 'w-16 h-16' }) {
  const renderScene = () => {
    switch (scene) {
      case 'ark':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Arcoíris del pacto */}
            <path d="M16 62C16 38 31 22 50 22C69 22 84 38 84 62" stroke="#FB7185" strokeWidth="5" strokeLinecap="round" />
            <path d="M22 62C22 42 34 28 50 28C66 28 78 42 78 62" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
            <path d="M28 62C28 46 38 34 50 34C62 34 72 46 72 62" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
            {/* Casco del Arca de Noé */}
            <path d="M18 62H82L72 80H28L18 62Z" fill="#B45309" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
            <rect x="33" y="48" width="34" height="14" rx="4" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            <path d="M29 50L50 38L71 50" stroke="#78350F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Olas de agua */}
            <path d="M12 83C20 79 28 87 36 83C44 79 52 87 60 83C68 79 76 87 88 83" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'shepherd':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Colina verde */}
            <circle cx="50" cy="50" r="42" fill="#E0F2FE" />
            <path d="M12 74C28 60 72 60 88 74L82 88H18L12 74Z" fill="#4ADE80" />
            {/* Nube / Ovejita esponjosa */}
            <circle cx="42" cy="56" r="11" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
            <circle cx="53" cy="53" r="12" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
            <circle cx="62" cy="58" r="9" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
            <circle cx="36" cy="57" r="7" fill="#334155" />
            <circle cx="34.5" cy="55.5" r="1.5" fill="#FFFFFF" />
            {/* Cayado del Buen Pastor */}
            <path d="M74 82V38C74 30 64 30 64 37" stroke="#B45309" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'shield':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M50 14L80 26V50C80 70 67 83 50 90C33 83 20 70 20 50V26L50 14Z"
              fill="url(#shieldGrad)"
              stroke="#1E3A8A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path d="M50 28V74M33 48H67" stroke="#FEF08A" strokeWidth="6" strokeLinecap="round" />
            <defs>
              <linearGradient id="shieldGrad" x1="20" y1="14" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'crown':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M16 72L24 34L41 52L50 26L59 52L76 34L84 72H16Z"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <rect x="16" y="72" width="68" height="10" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <circle cx="50" cy="22" r="5" fill="#FEF08A" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="23" cy="30" r="4" fill="#FB7185" />
            <circle cx="77" cy="30" r="4" fill="#38BDF8" />
            <circle cx="50" cy="60" r="4.5" fill="#FB7185" />
          </svg>
        );

      case 'scroll':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <rect x="24" y="20" width="52" height="60" rx="6" fill="#FEF3C7" stroke="#B45309" strokeWidth="3.5" />
            <rect x="18" y="16" width="64" height="10" rx="5" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            <rect x="18" y="74" width="64" height="10" rx="5" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            <path d="M35 38H65M35 50H65M35 62H53" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'heart':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M50 84C50 84 16 62 16 37C16 24 26 16 37 16C44 16 48 20 50 25C52 20 56 16 63 16C74 16 84 24 84 37C84 62 50 84 50 84Z"
              fill="#FB7185"
              stroke="#BE123C"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path d="M32 30C28 33 27 38 27 42" stroke="#FFE4E6" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'dove':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="38" fill="#E0F2FE" />
            <path
              d="M68 44C64 34 52 32 45 40L26 32C28 46 36 54 44 56L30 68H56C68 68 76 58 74 48L82 44L74 41C72 41 70 42 68 44Z"
              fill="#FFFFFF"
              stroke="#0284C7"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Ramita de olivo */}
            <path d="M76 43L88 36" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="34" r="3.5" fill="#22C55E" />
          </svg>
        );

      case 'mountain':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="72" cy="26" r="10" fill="#FDE047" />
            <path d="M12 80L42 28L66 72L12 80Z" fill="#6366F1" stroke="#312E81" strokeWidth="3" strokeLinejoin="round" />
            <path d="M44 80L68 38L90 80H44Z" fill="#818CF8" stroke="#312E81" strokeWidth="3" strokeLinejoin="round" />
            <path d="M42 28L33 44L42 40L50 44L42 28Z" fill="#FFFFFF" />
          </svg>
        );

      case 'sun':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="24" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" />
            <path
              d="M50 12V20M50 80V88M12 50H20M80 50H88M23 23L29 29M71 71L77 77M77 23L71 29M29 71L23 77"
              stroke="#F59E0B"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="43" cy="46" r="2.5" fill="#713F12" />
            <circle cx="57" cy="46" r="2.5" fill="#713F12" />
            <path d="M44 55C47 59 53 59 56 55" stroke="#713F12" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        );

      case 'star':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M50 14L61 37L86 40L68 58L72 83L50 71L28 83L32 58L14 40L39 37L50 14Z"
              fill="#FDE047"
              stroke="#D97706"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle cx="43" cy="48" r="2.8" fill="#78350F" />
            <circle cx="57" cy="48" r="2.8" fill="#78350F" />
            <path d="M45 57C48 60 52 60 55 57" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        );

      case 'lamp':
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="72" cy="30" r="14" fill="#FEF08A" />
            <path d="M72 16C72 16 82 26 82 34C82 39.5 77.5 44 72 44C66.5 44 62 39.5 62 34C62 26 72 16 72 16Z" fill="#F59E0B" />
            <path d="M20 56C20 47 30 43 46 43C62 43 72 48 82 44C86 42 90 45 88 50C83 62 69 76 47 76C29 76 20 66 20 56Z" fill="#FBBF24" stroke="#92400E" strokeWidth="3.5" />
            <path d="M34 76H60L64 84H30L34 76Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 16 }}
      className={`inline-flex items-center justify-center select-none ${className}`}
    >
      {renderScene()}
    </motion.div>
  );
}
