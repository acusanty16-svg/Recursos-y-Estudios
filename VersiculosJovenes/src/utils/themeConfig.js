// Paleta oficial Desafío 119:9: Negro profundo + Cian Neón (#22D3EE) + Coral Neón (#FF5D6C)
export const LEVEL_THEMES = {
  cyan: {
    name: 'Cian Neón',
    primary: '#22D3EE',
    secondary: '#06B6D4',
    accentText: 'text-cyan-400',
    accentTextLight: 'text-cyan-200',
    bgGlow: 'from-cyan-500/20 via-cyan-600/5 to-transparent',
    orbBg: 'bg-cyan-500/15',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40',
    pillSolid: 'bg-cyan-400 text-zinc-950 font-extrabold',
    borderGlow: 'border-cyan-400/45 hover:border-cyan-300/75 shadow-[0_0_30px_-10px_rgba(34,211,238,0.28)]',
    activeBorder: 'border-cyan-400',
    buttonPrimary:
      'bg-gradient-to-r from-cyan-400 to-cyan-500 text-zinc-950 font-extrabold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40',
    buttonGhost:
      'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/35',
    wordHighlight:
      'bg-cyan-500/15 text-cyan-300 border-cyan-400/45 shadow-[0_0_15px_rgba(34,211,238,0.22)]',
    progressFill: 'bg-gradient-to-r from-cyan-400 to-coral-400',
    ringColor: 'ring-cyan-400/40',
    hex: '#22d3ee',
  },
  coral: {
    name: 'Coral Neón',
    primary: '#FF5D6C',
    secondary: '#F43F5E',
    accentText: 'text-coral-400',
    accentTextLight: 'text-coral-300',
    bgGlow: 'from-coral-400/20 via-coral-500/5 to-transparent',
    orbBg: 'bg-coral-400/15',
    badgeBg: 'bg-coral-400/15 text-coral-300 border-coral-400/40',
    pillSolid: 'bg-coral-400 text-zinc-950 font-extrabold',
    borderGlow: 'border-coral-400/45 hover:border-coral-300/75 shadow-[0_0_30px_-10px_rgba(255,93,108,0.28)]',
    activeBorder: 'border-coral-400',
    buttonPrimary:
      'bg-gradient-to-r from-coral-400 to-rose-500 text-white font-extrabold shadow-lg shadow-coral-400/25 hover:shadow-coral-400/40',
    buttonGhost:
      'bg-coral-400/10 hover:bg-coral-400/20 text-coral-300 border border-coral-400/35',
    wordHighlight:
      'bg-coral-400/15 text-coral-300 border-coral-400/45 shadow-[0_0_15px_rgba(255,93,108,0.22)]',
    progressFill: 'bg-gradient-to-r from-coral-400 to-cyan-400',
    ringColor: 'ring-coral-400/40',
    hex: '#ff5d6c',
  },
};

export const getTheme = (temaColor) => LEVEL_THEMES[temaColor] || LEVEL_THEMES.cyan;

// Limpia signos de puntuación para comparar palabras clave con tokens del texto
export const cleanWord = (word = '') =>
  word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ]/g, '');
