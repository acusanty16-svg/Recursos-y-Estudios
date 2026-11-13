import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { toggleMetronome, useMetronomeState } from '@controller/metronome.service';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { EditorialFade, TabHighlightPill } from '@ui/components/MotionPrimitives';
import { FretboardExplorer } from '@ui/music/FretboardExplorer';
import { ChordLibrary } from '@ui/music/ChordLibrary';
import { ChristianSongbook } from '@ui/music/ChristianSongbook';
import { MetronomePanel } from '@ui/music/MetronomePanel';
import { PauseIcon, RefreshIcon } from '@ui/components/icons';

type MusicTab = 'songs' | 'fretboard' | 'chords' | 'metronome';

interface MusicRouteState {
  readonly tab?: MusicTab | undefined;
  readonly songId?: string | undefined;
}

/**
 * Estudio Musical & Guitarra:
 * - Almacén de Canciones Cristianas estilo LaCuerda.net (sincronizado con Google Drive)
 * - Diapasón interactivo de 15 trastes (Americano / Latino / Escalas / Quiz)
 * - Diccionario de acordes y Círculo Armónico por tonalidad
 * - Metrónomo Web Audio con Tap Tempo y sincronización con canciones
 */
export function MusicPage() {
  const { t, language } = useI18n();
  const { account } = useAppStore();
  const metro = useMetronomeState();
  const location = useLocation();
  const routeState = (location.state as MusicRouteState | null) ?? null;

  const [tab, setTab] = useState<MusicTab>(() => routeState?.tab ?? 'songs');

  useEffect(() => {
    if (routeState?.tab) {
      setTab(routeState.tab);
    } else if (routeState?.songId) {
      setTab('songs');
    }
  }, [routeState]);

  const tabs: readonly { readonly id: MusicTab; readonly label: string }[] = [
    { id: 'songs', label: t('music.tabSongs') },
    { id: 'fretboard', label: t('music.tabFretboard') },
    { id: 'chords', label: t('music.tabChords') },
    { id: 'metronome', label: t('music.tabMetronome') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={language === 'es' ? 'Ministerio & Práctica' : 'Worship & Practice'}
        title={t('music.title')}
        subtitle={t('music.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {metro.running && (
              <button
                type="button"
                onClick={toggleMetronome}
                className="inline-flex items-center gap-2 rounded-full border border-ember-500/35 bg-ember-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-ember-700 transition hover:bg-ember-500/20 dark:border-ember-400/35 dark:text-ember-300"
              >
                <PauseIcon className="h-3 w-3" />
                <span>{metro.bpm} BPM</span>
              </button>
            )}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)]">
              <RefreshIcon className={account.status === 'signed-in' ? 'h-3.5 w-3.5 text-emerald-500' : 'h-3.5 w-3.5'} />
              <span>
                {account.status === 'signed-in'
                  ? t('settings.synced')
                  : language === 'es'
                    ? 'Local (conecta Google en Ajustes para respaldar)'
                    : 'Local (sign in with Google in Settings to sync)'}
              </span>
            </div>
          </div>
        }
      />

      {/* Selector de pestañas con indicador spring */}
      <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={[
                'relative z-10 rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm',
                active ? 'text-navy-900 dark:text-navy-950' : 'text-[var(--muted)] hover:text-[var(--ink)]',
              ].join(' ')}
            >
              {active && (
                <TabHighlightPill
                  layoutId="music-tab-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-white shadow-xs dark:bg-ember-400"
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <EditorialFade key={tab}>
          {tab === 'songs' && <ChristianSongbook initialSongId={routeState?.songId} />}
          {tab === 'fretboard' && <FretboardExplorer />}
          {tab === 'chords' && <ChordLibrary />}
          {tab === 'metronome' && <MetronomePanel />}
        </EditorialFade>
      </AnimatePresence>
    </div>
  );
}
