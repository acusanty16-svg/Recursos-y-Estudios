import { getVoicingMidiNotes, type ChordVoicing } from '@model/music';
import { strumGuitarChord } from '@controller/guitar-audio.service';

interface ChordDiagramProps {
  readonly symbol: string;
  readonly voicing: ChordVoicing;
  readonly compact?: boolean | undefined;
  readonly onSelect?: (() => void) | undefined;
}

const FRET_ROWS = 4;

/**
 * Diagrama vectorial SVG de acorde para guitarra (6 cuerdas verticales, cejillas, dedos, O/X).
 * Al pulsar reproduce el rasgueo acústico sintetizado mediante Web Audio API.
 */
export function ChordDiagram({ symbol, voicing, compact = false, onSelect }: ChordDiagramProps) {
  const width = compact ? 104 : 156;
  const height = compact ? 124 : 184;
  const padLeft = compact ? 22 : 32;
  const padRight = compact ? 14 : 20;
  const padTop = compact ? 30 : 42;
  const gridWidth = width - padLeft - padRight;
  const gridHeight = compact ? 74 : 112;
  const stringGap = gridWidth / 5;
  const fretGap = gridHeight / FRET_ROWS;

  const baseFret = Math.max(1, voicing.baseFret);

  const stringIndexToX = (zeroBased6to1: number): number => padLeft + zeroBased6to1 * stringGap;
  const fretToY = (relativeRow: number): number => padTop + relativeRow * fretGap;

  const handlePlay = (): void => {
    strumGuitarChord(getVoicingMidiNotes(voicing));
    onSelect?.();
  };

  const barre = voicing.barre;
  const barreRow = barre ? barre.fret - baseFret + 1 : -1;

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={`${symbol} · ${voicing.label}`}
      className={[
        'group flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition',
        'hover:border-[var(--accent)] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40',
        compact ? 'p-2' : 'p-3.5',
      ].join(' ')}
    >
      <div className="flex w-full items-baseline justify-between gap-1 px-1">
        <span className={compact ? 'font-mono text-xs font-bold text-[var(--ink)]' : 'font-mono text-base font-bold text-[var(--ink)]'}>
          {symbol}
        </span>
        {!compact && <span className="truncate text-[10px] font-medium text-[var(--muted)]">{voicing.label}</span>}
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mt-1 select-none"
        aria-label={`Acorde ${symbol}`}
      >
        {/* Número de traste base si no es cejuela */}
        {baseFret > 1 && (
          <text
            x={padLeft - 7}
            y={padTop + fretGap * 0.68}
            textAnchor="end"
            className="fill-[var(--muted)] font-mono font-semibold"
            fontSize={compact ? 9 : 11}
          >
            {baseFret}fr
          </text>
        )}

        {/* Cejuela superior o barra de traste inicial */}
        <line
          x1={padLeft}
          y1={padTop}
          x2={padLeft + gridWidth}
          y2={padTop}
          stroke="currentColor"
          strokeWidth={baseFret === 1 ? (compact ? 3.5 : 4.5) : 1.2}
          className="text-[var(--ink)]"
        />

        {/* Líneas horizontales de trastes */}
        {Array.from({ length: FRET_ROWS }, (_, idx) => {
          const y = fretToY(idx + 1);
          return (
            <line
              key={idx}
              x1={padLeft}
              y1={y}
              x2={padLeft + gridWidth}
              y2={y}
              stroke="currentColor"
              strokeWidth={1}
              className="text-[var(--border)]"
            />
          );
        })}

        {/* 6 cuerdas verticales (6ª izquierda -> 1ª derecha) */}
        {Array.from({ length: 6 }, (_, idx) => {
          const x = stringIndexToX(idx);
          const strokeWidth = compact ? 1 + (5 - idx) * 0.14 : 1.1 + (5 - idx) * 0.18;
          return (
            <line
              key={idx}
              x1={x}
              y1={padTop}
              x2={x}
              y2={padTop + gridHeight}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-[var(--muted)] opacity-75"
            />
          );
        })}

        {/* Cejilla (barre) */}
        {barre && barreRow >= 1 && barreRow <= FRET_ROWS && (
          <rect
            x={stringIndexToX(6 - barre.toString) - (compact ? 5 : 7)}
            y={fretToY(barreRow - 0.5) - (compact ? 4.5 : 6.5)}
            width={
              stringIndexToX(6 - barre.fromString) -
              stringIndexToX(6 - barre.toString) +
              (compact ? 10 : 14)
            }
            height={compact ? 9 : 13}
            rx={compact ? 4.5 : 6.5}
            className="fill-[var(--accent)]"
          />
        )}

        {/* Marcadores por cuerda: X (mute), O (al aire) y dedos pisados */}
        {voicing.frets.map((fret, idx) => {
          const x = stringIndexToX(idx);
          const finger = voicing.fingers[idx] ?? 0;

          if (fret < 0) {
            return (
              <text
                key={idx}
                x={x}
                y={padTop - (compact ? 8 : 11)}
                textAnchor="middle"
                fontSize={compact ? 9 : 11}
                fontWeight="700"
                className="fill-[var(--muted)]"
              >
                ×
              </text>
            );
          }

          if (fret === 0) {
            return (
              <circle
                key={idx}
                cx={x}
                cy={padTop - (compact ? 11 : 14)}
                r={compact ? 3 : 4}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-[var(--ink)]"
              />
            );
          }

          const relRow = fret - baseFret + 1;
          if (relRow < 1 || relRow > FRET_ROWS) return null;
          const cy = fretToY(relRow - 0.5);
          const r = compact ? 5.5 : 8;

          return (
            <g key={idx}>
              <circle cx={x} cy={cy} r={r} className="fill-ember-600 dark:fill-ember-400" />
              {finger > 0 && (
                <text
                  x={x}
                  y={cy + (compact ? 3 : 3.5)}
                  textAnchor="middle"
                  fontSize={compact ? 7.5 : 9.5}
                  fontWeight="700"
                  className="fill-parchment-50 dark:fill-navy-950"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </button>
  );
}
