import { useEffect, useRef, useState } from 'react';
import { showToast } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { Dialog } from './Dialog';
import { DownloadIcon } from './icons';

type CardTheme = 'night' | 'parchment' | 'sky';

interface VerseShareDialogProps {
  readonly text: string;
  readonly citation: string;
  readonly onClose: () => void;
}

const THEMES: Record<
  CardTheme,
  {
    readonly bgTop: string;
    readonly bgBottom: string;
    readonly glow: string;
    readonly textColor: string;
    readonly accentColor: string;
    readonly mutedColor: string;
    readonly borderColor: string;
  }
> = {
  night: {
    bgTop: '#0B0D11',
    bgBottom: '#161922',
    glow: 'rgba(224, 180, 90, 0.16)',
    textColor: '#F2EFE9',
    accentColor: '#E0B45A',
    mutedColor: 'rgba(242, 239, 233, 0.6)',
    borderColor: 'rgba(242, 239, 233, 0.14)',
  },
  parchment: {
    bgTop: '#FAF8F4',
    bgBottom: '#EFE8D8',
    glow: 'rgba(154, 111, 31, 0.14)',
    textColor: '#15181E',
    accentColor: '#9A6F1F',
    mutedColor: 'rgba(21, 24, 30, 0.6)',
    borderColor: 'rgba(21, 24, 30, 0.12)',
  },
  sky: {
    bgTop: '#0A1A2F',
    bgBottom: '#162E4E',
    glow: 'rgba(93, 146, 187, 0.30)',
    textColor: '#FBF9F2',
    accentColor: '#9DC6E4',
    mutedColor: 'rgba(247, 243, 232, 0.65)',
    borderColor: 'rgba(157, 198, 228, 0.22)',
  },
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function VerseShareDialog({ text, citation, onClose }: VerseShareDialogProps) {
  const { t } = useI18n();
  const [theme, setTheme] = useState<CardTheme>('night');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const palette = THEMES[theme];
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, palette.bgTop);
    grad.addColorStop(1, palette.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const radial = ctx.createRadialGradient(width * 0.82, height * 0.15, 20, width * 0.82, height * 0.15, 620);
    radial.addColorStop(0, palette.glow);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = palette.borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    ctx.fillStyle = palette.accentColor;
    ctx.font = '600 180px Georgia, serif';
    ctx.fillText('“', 96, 230);

    const fontSize = text.length > 210 ? 40 : text.length > 130 ? 46 : 54;
    ctx.fillStyle = palette.textColor;
    ctx.font = `400 ${fontSize}px Georgia, serif`;
    const lines = wrapLines(ctx, text, width - 210);
    const lineHeight = fontSize * 1.48;
    const blockHeight = lines.length * lineHeight;
    let y = Math.max(290, (height - blockHeight) / 2);

    for (const line of lines) {
      ctx.fillText(line, 105, y);
      y += lineHeight;
    }

    ctx.fillStyle = palette.accentColor;
    ctx.fillRect(105, height - 188, 64, 4);

    ctx.font = '600 30px system-ui, -apple-system, sans-serif';
    ctx.fillText(citation, 105, height - 135);

    ctx.fillStyle = palette.mutedColor;
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.fillText("SANTI'S VERSICLES", 105, height - 92);
  }, [theme, text, citation]);

  const handleDownload = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${citation.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
    anchor.click();
    showToast(t('share.downloaded'), 'success');
  };

  return (
    <Dialog title={t('share.title')} subtitle={t('share.subtitle')} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'night', label: t('share.themeNight') },
              { id: 'parchment', label: t('share.themeParchment') },
              { id: 'sky', label: t('share.themeSky') },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`sv-btn border text-xs ${
                theme === opt.id
                  ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                  : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-navy-900/10 bg-navy-950/10 dark:border-parchment-100/15">
          <canvas ref={canvasRef} className="mx-auto aspect-square w-full max-w-md" />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="sv-btn sv-btn-ghost" onClick={onClose}>
            {t('common.close')}
          </button>
          <button type="button" className="sv-btn sv-btn-primary" onClick={handleDownload}>
            <DownloadIcon size={16} />
            {t('share.downloadPng')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
