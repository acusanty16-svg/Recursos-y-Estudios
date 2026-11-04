import { useEffect, useState } from 'react';

interface VisualViewportSize {
  readonly height: number;
  readonly offsetTop: number;
}

function readViewport(): VisualViewportSize {
  if (typeof window === 'undefined') return { height: 0, offsetTop: 0 };
  const viewport = window.visualViewport;
  return {
    height: viewport?.height || window.innerHeight,
    offsetTop: viewport?.offsetTop ?? 0,
  };
}

/**
 * Sigue el viewport visible para que los diálogos queden por encima del
 * teclado virtual en móvil. `100dvh` no siempre descuenta el teclado.
 */
export function useVisualViewport(): VisualViewportSize {
  const [size, setSize] = useState<VisualViewportSize>(readViewport);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = (): void => {
      setSize({
        height: viewport.height || window.innerHeight,
        offsetTop: viewport.offsetTop,
      });
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return size;
}
