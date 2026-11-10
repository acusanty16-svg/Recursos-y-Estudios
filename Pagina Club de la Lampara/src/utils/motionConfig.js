// Configuración centralizada de animaciones siguiendo motion-dev-animations
// Respeta prefers-reduced-motion y separa la física de muelles entre Infantil y General

export const SPRING_KIDS = {
  type: 'spring',
  stiffness: 360,
  damping: 20,
  mass: 1,
};

export const SPRING_GENERAL = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 1,
};

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];

export function getStaggerContainer(stagger = 0.06, reduced = false) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : 0.05,
      },
    },
  };
}

export function getKidsCardVariants(reduced = false) {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.2 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: SPRING_KIDS,
    },
  };
}

export function getGeneralCardVariants(reduced = false) {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.2 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE_OUT_EXPO },
    },
  };
}

// Utilidad de voz (Web Speech API) para escuchar el versículo o la historia infantil
export function speakText(text, rate = 0.92) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = rate;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
