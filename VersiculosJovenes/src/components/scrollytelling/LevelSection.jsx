import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  CheckCircle2,
  Feather,
  Flame,
  Heart,
  Lock,
  Shield,
  Trophy,
} from 'lucide-react';
import { getTheme } from '../../utils/themeConfig';
import { getVerseStudyStatus } from '../../utils/studyMastery';
import {
  CHALLENGE_META,
  formatShortDateEs,
  getChallengePhase,
} from '../../utils/challengeSchedule';
import { soundFX } from '../../utils/soundEffects';
import DesafioBrandMark from '../layout/DesafioBrandMark';
import VerseStation from './VerseStation';

function getWeekIcon(iconName) {
  switch (iconName) {
    case 'heart':
      return Heart;
    case 'shield':
      return Shield;
    case 'strength':
      return Flame;
    case 'dove':
      return Feather;
    default:
      return Heart;
  }
}

export default function LevelSection({
  niveles = [],
  nivel,
  verses = [],
  activeTodayKey,
  leaderUnlockAll = false,
  getVerseXp,
  onSelectLevel,
  isLevelUnlocked,
  getLevelMasteryCount,
  completedGames,
  completedMissions = [],
  onToggleMissionDone,
  onOpenGame,
  onExploreVerse,
  onOpenFinalChallenge,
}) {
  const theme = getTheme(nivel.temaColor);
  const activeVerse = verses[0] || null;
  const phaseInfo = getChallengePhase(niveles, activeTodayKey);
  const graceUnlocked = leaderUnlockAll && phaseInfo.todayKey === activeTodayKey
    ? phaseInfo.isGraceWeekUnlocked || true
    : phaseInfo.isGraceWeekUnlocked;
  const finaleUnlocked = leaderUnlockAll && phaseInfo.todayKey === activeTodayKey
    ? phaseInfo.isGrandFinaleUnlocked || true
    : phaseInfo.isGrandFinaleUnlocked;

  return (
    <section
      id="active-level-stage"
      className="relative pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      {/* Luces duales de fondo como el cartel oficial */}
      <div className="absolute -top-6 left-0 w-72 h-72 rounded-full bg-cyan-400/12 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-6 right-0 w-72 h-72 rounded-full bg-coral-400/12 blur-[120px] pointer-events-none -z-10" />

      {/* Cabecera Oficial DESAFÍO 119:9 */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-950/90 border border-white/15 shadow-lg">
          <DesafioBrandMark size={30} />
          <div className="text-left leading-none">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 block">
              {CHALLENGE_META.baseReference}
            </span>
            <span className="font-mono text-xs font-bold text-white">
              {phaseInfo.isGrandFinaleUnlocked
                ? '🏆 ¡Hoy es la Gran Final!'
                : `⏳ Faltan ${phaseInfo.daysToGrandFinale} ${
                    phaseInfo.daysToGrandFinale === 1 ? 'día' : 'días'
                  } para la Gran Final (19 Dic)`}
            </span>
          </div>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight leading-none">
          <span className="text-cyan-400">DESAFÍO</span>{' '}
          <span className="text-coral-400">119:9</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-medium">
          {CHALLENGE_META.slogan}
        </p>
      </div>

      {/* Estación interactiva del versículo de la semana seleccionada */}
      <AnimatePresence mode="wait">
        {activeVerse && (
          <VerseStation
            key={activeVerse.id}
            verse={activeVerse}
            verseXp={getVerseXp ? getVerseXp(activeVerse.id) : 0}
            theme={theme}
            totalWeeks={niveles.length}
            completedGames={completedGames[activeVerse.id] || {}}
            isMissionDone={completedMissions.includes(activeVerse.id)}
            hasPrev={nivel.id > 1}
            hasNext={
              nivel.id < niveles.length &&
              isLevelUnlocked(nivel.id + 1, verses, niveles)
            }
            onPrevMission={() => onSelectLevel(Math.max(1, nivel.id - 1))}
            onNextMission={() => onSelectLevel(Math.min(niveles.length, nivel.id + 1))}
            onToggleMissionDone={onToggleMissionDone}
            onOpenGame={onOpenGame}
            onExploreVerse={onExploreVerse}
          />
        )}
      </AnimatePresence>

      {/* Rejilla oficial de las 4 Semanas + Semana 5 de Gracia + Gran Final */}
      <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-zinc-950/75 border border-white/10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
              Calendario del Reto
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              4 Semanas + Semana de Gracia + Gran Final
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            {phaseInfo.unlockedCount}/4 semanas abiertas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Semanas 1 a 4 */}
          {niveles.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.id, verses, niveles);
            const isCurrent = lvl.id === nivel.id;
            const isCoral = lvl.temaColor === 'coral';
            const WeekIcon = getWeekIcon(lvl.icono);
            const count = getLevelMasteryCount(lvl.id, verses);
            const mastered = count >= 1;
            const vXp = getVerseXp ? getVerseXp(lvl.id) : 0;
            const study = getVerseStudyStatus(vXp);

            const borderClass = unlocked
              ? isCurrent
                ? isCoral
                  ? 'border-coral-400 bg-coral-400/10 shadow-[0_0_24px_-8px_rgba(255,93,108,0.45)]'
                  : 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_24px_-8px_rgba(34,211,238,0.45)]'
                : isCoral
                  ? 'border-coral-400/40 bg-zinc-950/90 hover:border-coral-400'
                  : 'border-cyan-400/40 bg-zinc-950/90 hover:border-cyan-400'
              : 'border-white/10 bg-zinc-950/60 opacity-75';

            const pillClass = isCoral
              ? 'bg-coral-400 text-zinc-950'
              : 'bg-cyan-400 text-zinc-950';

            return (
              <button
                key={lvl.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectLevel(lvl.id);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${borderClass}`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className={`px-3 py-0.5 rounded-full font-mono text-[11px] font-extrabold uppercase ${pillClass}`}>
                    SEMANA {lvl.id}
                  </span>
                  {mastered ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Dominado
                    </span>
                  ) : !unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <Lock className="w-3.5 h-3.5" /> {formatShortDateEs(lvl.unlockDate)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-zinc-400">
                      {formatShortDateEs(lvl.unlockDate)} – {formatShortDateEs(lvl.endDate)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCoral
                        ? 'bg-coral-400/15 border-coral-400/35 text-coral-400'
                        : 'bg-cyan-400/15 border-cyan-400/35 text-cyan-400'
                    }`}
                  >
                    {unlocked ? <WeekIcon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-white truncate">
                      {unlocked
                        ? lvl.subtituloGeneral.replace(`Semana ${lvl.id} · `, '')
                        : `Se abre el ${formatShortDateEs(lvl.unlockDate)}`}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {unlocked
                        ? `${study.current.label} · ${vXp} XP`
                        : lvl.subtituloInfantil}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Semana 5: Semana de Gracia */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenFinalChallenge('grace');
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
              graceUnlocked
                ? 'border-cyan-400/70 bg-cyan-400/10 hover:border-cyan-300 shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)]'
                : 'border-cyan-400/25 bg-zinc-950/70 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="px-3 py-0.5 rounded-full font-mono text-[11px] font-extrabold uppercase bg-cyan-400 text-zinc-950">
                SEMANA 5
              </span>
              {!graceUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300/80">
                  <Lock className="w-3.5 h-3.5" /> {formatShortDateEs(CHALLENGE_META.graceWeekStart)}
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold text-cyan-300">¡Abierta!</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/35 text-cyan-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">Semana de Gracia</p>
                <p className="text-xs text-cyan-300 font-medium">¡Prepárate para el gran final!</p>
              </div>
            </div>
          </button>

          {/* Gran Final · 19 de Diciembre */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenFinalChallenge('finale');
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
              finaleUnlocked
                ? 'border-coral-400 bg-coral-400/15 hover:border-coral-300 shadow-[0_0_28px_-8px_rgba(255,93,108,0.5)]'
                : 'border-coral-400/30 bg-zinc-950/70 opacity-85'
            }`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="px-3 py-0.5 rounded-full font-mono text-[11px] font-extrabold uppercase bg-coral-400 text-zinc-950">
                GRAN FINAL
              </span>
              {!finaleUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-coral-300/80">
                  <Lock className="w-3.5 h-3.5" /> 19 dic
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold text-coral-300">¡Hoy!</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-400/15 border border-coral-400/35 text-coral-400 flex items-center justify-center shrink-0">
                {finaleUnlocked ? <Award className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">19 de Diciembre</p>
                <p className="text-xs text-coral-300 font-medium">¡Demuestra y recibe tu reconocimiento!</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
