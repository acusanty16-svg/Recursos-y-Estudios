import React, { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Trophy,
  Search,
  Award,
  X,
  CheckCircle2,
  ArrowUpRight,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Swords,
  User,
  Share2,
  Check,
  BarChart3,
} from 'lucide-react';
import { getTheme } from '../../utils/themeConfig';
import { getPlayerRank } from '../../utils/youthApplications';
import { formatShortDateEs } from '../../utils/challengeSchedule';
import { soundFX } from '../../utils/soundEffects';
import DesafioBrandMark from './DesafioBrandMark';

const PREVIEW_DATES = [
  { label: 'Hoy real', value: null },
  { label: 'Sem 2 (23 nov)', value: '2026-11-23' },
  { label: 'Sem 3 (30 nov)', value: '2026-11-30' },
  { label: 'Sem 4 (7 dic)', value: '2026-12-07' },
  { label: 'Gracia (14 dic)', value: '2026-12-14' },
  { label: 'Final (19 dic)', value: '2026-12-19' },
];

export default function NavbarHUD({
  niveles,
  versiculos,
  activeLevelId,
  playerName,
  onChangePlayerName,
  xp,
  totalMastered,
  leaderUnlockAll,
  previewDate,
  onSetPreviewDate,
  onToggleLeaderUnlock,
  getLevelMasteryCount,
  isLevelUnlocked,
  onSelectLevel,
  onJumpToVerse,
  onOpenVersus,
  onOpenLeaderboard,
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isMuted, setIsMuted] = useState(soundFX.muted);
  const [copiedCard, setCopiedCard] = useState(false);

  const rankInfo = getPlayerRank(xp);

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.setMuted(next);
    if (!next) soundFX.playClick();
  };

  const handleShareProfileCard = () => {
    soundFX.playWin();
    const shareText =
      `⚡ DESAFÍO 119:9 — MI PROGRESO ⚡\n` +
      `👤 Participante: ${playerName || 'Joven Desafío 119:9'}\n` +
      `${rankInfo.current.badge} Rango: ${rankInfo.current.title} (${xp} XP)\n` +
      `🏆 Semanas Dominadas: ${totalMastered}/4\n` +
      `📖 "¡Es hora de demostrar lo que has guardado en tu corazón!" — Salmos 119:9`;
    navigator.clipboard?.writeText(shareText);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const filteredVerses = versiculos.filter((v) => {
    const unlocked = isLevelUnlocked(v.nivel, versiculos, niveles);
    if (!unlocked) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      v.referencia.toLowerCase().includes(q) ||
      v.titulo.toLowerCase().includes(q) ||
      v.texto.toLowerCase().includes(q) ||
      v.categoria.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/10">
        {/* Línea de progreso superior en degradado Cian -> Coral */}
        <motion.div
          className="h-[3px] origin-left bg-gradient-to-r from-cyan-400 to-coral-400"
          style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2.5">
          {/* Logo oficial Desafío 119:9 */}
          <a href="#top" className="flex items-center gap-2.5 group shrink-0">
            <DesafioBrandMark size={36} />
            <div className="leading-none">
              <span className="font-display font-extrabold tracking-tight text-base sm:text-lg block">
                <span className="text-cyan-400">DESAFÍO</span>{' '}
                <span className="text-coral-400">119:9</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                {rankInfo.current.badge} {rankInfo.current.title}
              </span>
            </div>
          </a>

          {/* Controles HUD */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setSearchOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition"
              title="Buscar versículo desbloqueado"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-mono">Buscar</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenLeaderboard?.();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300 transition"
              title="Ver Ranking Online del Grupo y Estudio por Versículo"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Ranking</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenVersus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral-400/15 hover:bg-coral-400/25 border border-coral-400/40 text-xs font-mono font-bold text-coral-300 transition"
              title="Modo Duelo 1 contra 1"
            >
              <Swords className="w-3.5 h-3.5 text-coral-400" />
              <span className="hidden sm:inline">Duelo 1v1</span>
            </button>

            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 transition"
              title={isMuted ? 'Activar efectos de sonido' : 'Silenciar efectos'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setBadgesOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/15 hover:border-cyan-400/50 transition"
              title="Ver Perfil, Semanas y Modo Líder"
            >
              <div className="flex items-center gap-1 text-xs font-mono text-cyan-400">
                <Trophy className="w-3.5 h-3.5" />
                <span className="font-bold">{totalMastered}/4</span>
              </div>
              <span className="text-zinc-700">|</span>
              <div className="flex items-center gap-1 text-xs font-mono text-coral-400">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-bold">{xp} XP</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Buscador de versículos desbloqueados */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl bg-[#090C13] border border-white/15 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca entre los versículos desbloqueados..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm sm:text-base"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-white/5">
                {filteredVerses.map((v) => {
                  const lvl = niveles.find((n) => n.id === v.nivel);
                  const t = getTheme(lvl?.temaColor);
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSearchOpen(false);
                        onJumpToVerse(v);
                      }}
                      className="w-full text-left p-3.5 rounded-2xl hover:bg-white/5 transition flex items-start justify-between gap-4 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold ${t.accentText}`}>
                            {v.referencia}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500">
                            • Semana 0{v.nivel}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white">{v.titulo}</p>
                        <p className="text-xs text-zinc-400 line-clamp-1">{v.texto}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 mt-1" />
                    </button>
                  );
                })}
                {filteredVerses.length === 0 && (
                  <p className="p-6 text-center text-xs font-mono text-zinc-400">
                    No hay coincidencias entre los versículos desbloqueados hasta hoy.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pasaporte Desafío 119:9 + Modo Líder */}
      <AnimatePresence>
        {badgesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBadgesOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-3xl bg-[#090C13] border border-white/15 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                    DESAFÍO 119:9 // PASAPORTE JUVENIL
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-white mt-0.5">
                    Tu Progreso Semanal
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleLeaderUnlock}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition ${
                      leaderUnlockAll
                        ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {leaderUnlockAll ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>Modo Líder: {leaderUnlockAll ? 'Activo' : 'Off'}</span>
                  </button>
                  <button
                    onClick={() => setBadgesOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Simulador de fechas cuando Modo Líder está activo */}
              {leaderUnlockAll && (
                <div className="p-4 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 space-y-2">
                  <p className="text-xs font-mono font-bold text-cyan-300">
                    VISTA PREVIA DE CALENDARIO (MODO LÍDER / PASTORES)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PREVIEW_DATES.map((item) => {
                      const active = previewDate === item.value;
                      return (
                        <button
                          key={item.label}
                          onClick={() => onSetPreviewDate?.(item.value)}
                          className={`px-3 py-1 rounded-full font-mono text-xs border transition ${
                            active
                              ? 'bg-cyan-400 text-zinc-950 border-cyan-300 font-extrabold'
                              : 'bg-zinc-950/80 text-zinc-300 border-white/10 hover:border-cyan-400/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tarjeta del Jugador */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-zinc-950/90 to-coral-400/15 border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TU NOMBRE PARA EL RECONOCIMIENTO FINAL:</span>
                  </div>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => onChangePlayerName(e.target.value)}
                    placeholder="Escribe tu nombre..."
                    className="w-full max-w-xs px-4 py-2 rounded-xl bg-zinc-950/90 border border-white/15 text-white font-display font-bold text-lg focus:outline-none focus:border-cyan-400"
                  />

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="px-3 py-1 rounded-xl bg-zinc-950/80 border border-white/10 font-mono text-xs font-bold text-white">
                      {rankInfo.current.badge} {rankInfo.current.title}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {xp} XP Totales
                    </span>
                    {rankInfo.next && (
                      <span className="text-xs font-mono text-zinc-400">
                        • Próximo rango: {rankInfo.next.title} ({rankInfo.next.minXp} XP)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleShareProfileCard}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-coral-400 text-zinc-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg"
                  >
                    {copiedCard ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Tarjeta Copiada para WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Compartir mi Progreso</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4 Semanas del Reto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {niveles.map((nivel) => {
                  const t = getTheme(nivel.temaColor);
                  const count = getLevelMasteryCount(nivel.id, versiculos);
                  const isUnlocked = isLevelUnlocked(nivel.id, versiculos, niveles);
                  const isCompleted = count >= 1;

                  return (
                    <div
                      key={nivel.id}
                      onClick={() => {
                        if (isUnlocked) {
                          setBadgesOpen(false);
                          onSelectLevel(nivel.id);
                        }
                      }}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCompleted
                          ? `${t.badgeBg} border-white/25 cursor-pointer`
                          : isUnlocked
                            ? 'bg-zinc-900/80 border-white/15 hover:border-white/30 cursor-pointer'
                            : 'bg-zinc-950/60 border-white/5 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-mono font-bold ${isUnlocked ? t.accentText : 'text-zinc-500'}`}>
                          SEMANA 0{nivel.id} // {nivel.insignia.toUpperCase()}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isUnlocked ? (
                          <Award className={`w-5 h-5 ${t.accentText}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {isUnlocked ? nivel.nombre : `Semana ${nivel.id} (Bloqueada)`}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {isUnlocked
                          ? nivel.subtituloInfantil
                          : `🔒 Se desbloquea el ${formatShortDateEs(nivel.unlockDate)}.`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
