import { useEffect, useState } from 'react';

export interface ReadingPosition {
  readonly activeVerse: number;
  readonly progress: number;
}

interface UseReadingPositionOptions {
  /** Cambia cuando cambia el capítulo para reiniciar la medición. */
  readonly chapterKey: string;
  readonly verseCount: number;
  /** Distancia desde el borde superior ocupada por la barra fija. */
  readonly offset?: number;
}

interface ChapterLayout {
  readonly tops: readonly number[];
  readonly start: number;
  readonly end: number;
}

function measureLayout(verseCount: number): ChapterLayout | null {
  const elements: (HTMLElement | null)[] = [];
  for (let verse = 1; verse <= verseCount; verse += 1) {
    elements.push(document.getElementById(`v${verse}`));
  }

  const first = elements[0];
  const last = elements[verseCount - 1];
  if (!first || !last) return null;

  const firstRect = first.getBoundingClientRect();
  const lastRect = last.getBoundingClientRect();

  return {
    tops: elements.map((element) =>
      element ? element.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY,
    ),
    start: firstRect.top + window.scrollY,
    end: lastRect.bottom + window.scrollY,
  };
}

/**
 * Sigue el versículo visible y el progreso del capítulo.
 * Cachea las posiciones para no leer el layout de cada versículo en cada frame.
 */
export function useReadingPosition({
  chapterKey,
  verseCount,
  offset = 180,
}: UseReadingPositionOptions): ReadingPosition {
  const [position, setPosition] = useState<ReadingPosition>({ activeVerse: 1, progress: 0 });

  useEffect(() => {
    if (verseCount <= 0) {
      setPosition({ activeVerse: 1, progress: 0 });
      return;
    }

    let layout = measureLayout(verseCount);
    let frame = 0;
    let disposed = false;

    const update = (): void => {
      frame = 0;
      if (disposed) return;
      layout ??= measureLayout(verseCount);
      if (!layout) return;

      const cursor = window.scrollY + offset;
      let activeVerse = 1;

      for (let index = 0; index < layout.tops.length; index += 1) {
        const top = layout.tops[index];
        if (top !== undefined && top <= cursor) activeVerse = index + 1;
        else break;
      }

      const rawProgress =
        layout.end > layout.start
          ? Math.min(1, Math.max(0, (cursor - layout.start) / (layout.end - layout.start)))
          : 0;
      const progress = Math.round(rawProgress * 100) / 100;

      setPosition((previous) =>
        previous.activeVerse === activeVerse && previous.progress === progress
          ? previous
          : { activeVerse, progress },
      );
    };

    const schedule = (): void => {
      if (disposed || frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    const remeasure = (): void => {
      if (disposed) return;
      layout = measureLayout(verseCount);
      schedule();
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);

    const first = document.getElementById('v1');
    const list = first?.parentElement;
    const observer = list ? new ResizeObserver(remeasure) : null;
    if (list && observer) observer.observe(list);

    void document.fonts.ready.then(() => {
      if (!disposed) remeasure();
    });

    return () => {
      disposed = true;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      observer?.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [chapterKey, verseCount, offset]);

  return position;
}
