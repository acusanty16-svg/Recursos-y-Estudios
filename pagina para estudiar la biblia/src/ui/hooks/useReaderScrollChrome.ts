import { useEffect, useRef, useState } from 'react';

export interface ScrollChromeState {
  readonly scrolled: boolean;
  readonly showGlobalHeader: boolean;
  readonly showFloatingReaderBar: boolean;
}

const TOP_THRESHOLD_PX = 110;
const SCROLL_DELTA_PX = 14;

/**
 * Coordina la visibilidad animada de la cabecera global y la barra flotante del lector
 * para que nunca haya dos barras fijas apiladas:
 * - Arriba del capítulo: cabecera global arriba + controles del lector integrados en el flujo.
 * - Al bajar leyendo: desaparece la cabecera global y queda solo la barra compacta del lector.
 * - Al subir: regresa suavemente la cabecera global para cambiar de sección al instante.
 */
export function useReaderScrollChrome(isReader: boolean): ScrollChromeState {
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastYRef = useRef(0);

  useEffect(() => {
    const sync = (): void => {
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 12);
      setAtTop(y <= TOP_THRESHOLD_PX);

      const delta = y - lastYRef.current;
      if (Math.abs(delta) >= SCROLL_DELTA_PX) {
        setDirection(delta > 0 ? 'down' : 'up');
        lastYRef.current = y;
      } else if (y <= 12) {
        setDirection('up');
        lastYRef.current = y;
      }
    };

    lastYRef.current = Math.max(0, window.scrollY);
    sync();

    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, [isReader]);

  if (!isReader) {
    return {
      scrolled,
      showGlobalHeader: true,
      showFloatingReaderBar: false,
    };
  }

  const showGlobalHeader = atTop || direction === 'up';
  const showFloatingReaderBar = !atTop && direction === 'down';

  return {
    scrolled,
    showGlobalHeader,
    showFloatingReaderBar,
  };
}
