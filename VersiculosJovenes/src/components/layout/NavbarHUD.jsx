import React, { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Sparkles,
  Trophy,
  Search,
  Shuffle,
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
} from 'lucide-react';
import { getTheme } from '../../utils/themeConfig';
import { getPlayerRank } from '../../utils/youthApplications';
import { soundFX } from '../../utils/soundEffects';

export default function NavbarHUD({
  niveles,
  versiculos,
  activeLevelId,
  playerName,
  onChangePlayerName,
  xp,
  totalMastered,
  leaderUnlockAll,
  onToggleLeaderUnlock,
  getLevelMasteryCount,
  isLevelUnlocked,
  onSelectLevel,
  onJumpToVerse,
  onOpenRandomGame,
  onOpenVersus,
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

  const activeLevelObj = niveles.find((n) => n.id === activeLevelId) || niveles[0];
  const activeTheme = getTheme(activeLevelObj?.temaColor);
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
      `🔥 TARJETA DE PROGRESO ICAF-VERSES 🔥\n` +
      `👤 Jugador: ${playerName || 'Joven ICAF'}\n` +
      `${rankInfo.current.badge} Rango: ${rankInfo.current.title} (${xp} XP)\n` +
      `🏆 Versículos Dominados: ${totalMastered}/48\n` +
      `⚡ Nivel Actual: Nivel 0${activeLevelId} (${activeLevelObj.insignia})`;
    navigator.clipboard?.writeText(shareText);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const filteredVerses = versiculos.filter((v) => {
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
        {/* Top Scroll Progress Line */}
        <motion.div
          className={`h-[3px] origin-left ${activeTheme.progressFill}`}
          style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2.5">
          {/* Brand Logo */}
          <a href="#top" className="flex items-center gap-2.5 group shrink-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${activeTheme.badgeBg}`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-none">
              <span className="font-display font-extrabold tracking-tight text-base sm:text-lg text-white block">
                ICAF<span className={activeTheme.accentText}>-Verses</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                {rankInfo.current.badge} {rankInfo.current.title}
              </span>
            </div>
          </a>

          {/* Right HUD Telemetry & Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setSearchOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition"
              title="Buscar versículo o referencia"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline font-mono">Buscar</span>
            </button>

            {/* Versus Duel Mode Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenVersus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-xs font-mono font-bold text-rose-300 transition"
              title="Modo Duelo 1 contra 1"
            >
              <Swords className="w-3.5 h-3.5 text-rose-400" />
              <span>Duelo 1v1</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 transition"
              title={isMuted ? 'Activar efectos de sonido' : 'Silenciar efectos'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>

            {/* Profile, Rank & Badges Pill */}
            <button
              onClick={() => {
                soundFX.playClick();
                setBadgesOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/15 hover:border-white/30 transition"
              title="Ver Perfil Juvenil, Rango, Tarjeta Compartible e Insignias"
            >
              <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                <span className="font-bold">{totalMastered}/48</span>
              </div>
              <span className="text-zinc-700">|</span>
              <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-bold">{xp} XP</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
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
              className="w-full max-w-2xl rounded-3xl bg-[#0D0F17] border border-white/15 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca por cita (ej. Salmos 119, Juan 3:16), palabra o tema..."
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
                  const unlocked = isLevelUnlocked(v.nivel, versiculos);
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
                          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                            • Nivel {v.nivel} · Misión 0{v.semana}
                            {!unlocked && <Lock className="w-3 h-3 text-zinc-500 inline" />}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white">{v.titulo}</p>
                        <p className="text-xs text-zinc-400 line-clamp-1">{v.texto}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Profile, Spotify-Wrapped Style Card & Level Unlocks Modal */}
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
              className="w-full max-w-4xl rounded-3xl bg-[#0D0F17] border border-white/15 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
            >
              {/* Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    PERFIL JUVENIL // RANGO E INSIGNIAS
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-white mt-0.5">
                    Pasaporte ICAF-Verses
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleLeaderUnlock}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition ${
                      leaderUnlockAll
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
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

              {/* Spotify-Wrapped Style Player Card + Name Input */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-sky-500/10 to-violet-500/15 border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>TU NOMBRE / ALIAS EN EL GRUPO:</span>
                  </div>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => onChangePlayerName(e.target.value)}
                    placeholder="Escribe tu nombre..."
                    className="w-full max-w-xs px-4 py-2 rounded-xl bg-zinc-950/90 border border-white/15 text-white font-display font-bold text-lg focus:outline-none focus:border-amber-400"
                  />

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="px-3 py-1 rounded-xl bg-zinc-950/80 border border-white/10 font-mono text-xs font-bold text-white">
                      {rankInfo.current.badge} {rankInfo.current.title}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {xp} XP Totales
                    </span>
                    {rankInfo.next && (
                      <span className="text-xs font-mono text-zinc-400">
                        • Próximo rango: {rankInfo.next.title} ({rankInfo.next.minXp} XP)
                      </span>
                    )}
                  </div>
                </div>

                {/* Shareable Story Card Button */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleShareProfileCard}
                    className="px-5 py-3 rounded-2xl bg-white text-zinc-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition shadow-lg"
                  >
                    {copiedCard ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>¡Tarjeta Copiada para WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Compartir mi Rango en el Grupo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 6 Levels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {niveles.map((nivel) => {
                  const t = getTheme(nivel.temaColor);
                  const count = getLevelMasteryCount(nivel.id, versiculos);
                  const isUnlocked = isLevelUnlocked(nivel.id, versiculos);
                  const isCompleted = count >= 8;
                  const pct = Math.round((count / 8) * 100);

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
                          NIVEL 0{nivel.id} // {nivel.insignia.toUpperCase()}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isUnlocked ? (
                          <Award className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{nivel.nombre}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                        {isUnlocked
                          ? nivel.subtituloGeneral.replace(/\s*\(Semanas.*?\)/i, '')
                          : `🔒 Supera el Nivel ${nivel.id - 1} para desbloquear.`}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                          <span>Misiones</span>
                          <span className="text-white font-bold">{count} / 8</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${t.progressFill}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
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
