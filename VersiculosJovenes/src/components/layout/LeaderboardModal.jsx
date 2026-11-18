import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  CloudOff,
  Crown,
  HelpCircle,
  Lock,
  RefreshCw,
  Sparkles,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react';
import { fetchLeaderboard, isSupabaseConfigured } from '../../lib/supabasePlayers';
import { getVerseStudyStatus } from '../../utils/studyMastery';
import { getPlayerRank } from '../../utils/youthApplications';
import { isWeekDateUnlocked } from '../../utils/challengeSchedule';
import { soundFX } from '../../utils/soundEffects';

export default function LeaderboardModal({
  open,
  niveles = [],
  effectiveTodayKey,
  leaderUnlockAll = false,
  currentPlayer,
  syncStatus,
  onSwitchNewPlayer,
  onClose,
}) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [switching, setSwitching] = useState(false);
  const [newName, setNewName] = useState('');
  const [showXpGuide, setShowXpGuide] = useState(false);
  const [hoveredPlayerXpId, setHoveredPlayerXpId] = useState(null);
  const [hoveredCellKey, setHoveredCellKey] = useState(null);

  const onlineConfigured = isSupabaseConfigured();

  const loadPlayers = useCallback(async () => {
    const localSelf = {
      id: currentPlayer.playerId,
      name: currentPlayer.playerName || 'Tú (Local)',
      xp: currentPlayer.xp || 0,
      verseXp: currentPlayer.verseXp || {},
      masteredCount: currentPlayer.masteredCount || 0,
      finaleBestScore: currentPlayer.finaleBestScore || 0,
      isLocalFallback: true,
    };

    if (!onlineConfigured) {
      setPlayers([localSelf]);
      setErrorMsg('');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await fetchLeaderboard(50);
    setLoading(false);

    if (res.ok) {
      const existsSelf = res.players.some((p) => p.id === currentPlayer.playerId);
      const merged = existsSelf
        ? res.players
        : currentPlayer.profileConfirmed
          ? [localSelf, ...res.players].sort((a, b) => b.xp - a.xp)
          : res.players;
      setPlayers(merged);
    } else {
      setPlayers([localSelf]);
      setErrorMsg('No pudimos conectar con el servidor ahora; mostrando tu puntaje local.');
    }
  }, [onlineConfigured, currentPlayer]);

  useEffect(() => {
    if (!open) return;
    loadPlayers();
    if (!onlineConfigured) return;
    const timer = setInterval(loadPlayers, 15000);
    return () => clearInterval(timer);
  }, [open, loadPlayers, onlineConfigured]);

  if (!open) return null;

  const handleSwitchSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    soundFX.playWin();
    onSwitchNewPlayer(newName.trim());
    setNewName('');
    setSwitching(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl rounded-3xl bg-[#090C13] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-400/15 border border-cyan-400/40 text-cyan-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-coral-400 block">
                  DESAFÍO 119:9 // TABLA DEL GRUPO
                </span>
                <h3 className="text-xl font-display font-extrabold text-white">
                  Ranking de Estudio y XP
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono ${
                  onlineConfigured
                    ? syncStatus === 'error'
                      ? 'border-coral-400/40 bg-coral-400/10 text-coral-300'
                      : 'border-cyan-400/35 bg-cyan-400/10 text-cyan-300'
                    : 'border-white/10 bg-white/5 text-zinc-400'
                }`}
              >
                {onlineConfigured ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
                <span>
                  {onlineConfigured
                    ? syncStatus === 'syncing'
                      ? 'Guardando...'
                      : 'En vivo (Supabase)'
                    : 'Modo Local'}
                </span>
              </span>

              <button
                onClick={loadPlayers}
                disabled={loading}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition disabled:opacity-40"
                title="Actualizar ranking"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-coral-400/20 text-zinc-300 hover:text-coral-300 border border-white/10 transition"
                aria-label="Cerrar ranking"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {!onlineConfigured && (
              <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-4 text-xs text-zinc-300 leading-relaxed">
                <strong className="text-cyan-300">Ranking Online listo para conectar:</strong>{' '}
                cuando añadas <code className="text-white">VITE_SUPABASE_URL</code> y{' '}
                <code className="text-white">VITE_SUPABASE_ANON_KEY</code> (ver{' '}
                <code className="text-white">CONFIGURAR_SUPABASE.md</code>), cada joven que entre desde su móvil guardará aquí su XP y su nivel de estudio en cada versículo.
              </div>
            )}

            {errorMsg && (
              <div className="rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-2.5 text-xs text-coral-200">
                {errorMsg}
              </div>
            )}

            {/* Leyenda de cómo decide la XP el nivel de estudio + Nota Hover "¿Cómo conseguir XP?" */}
            <div className="relative rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-[11px] font-mono text-zinc-400 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Escala por pasaje:</span>
                  <span className="text-cyan-300">1+ Explorado</span>
                  <span>·</span>
                  <span className="text-cyan-200">150+ En Proceso</span>
                  <span>·</span>
                  <span className="text-coral-300">350+ Guardado</span>
                  <span>·</span>
                  <span className="text-white font-bold">650+ Maestro 119:9</span>
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => setShowXpGuide(true)}
                  onMouseLeave={() => setShowXpGuide(false)}
                >
                  <button
                    type="button"
                    onFocus={() => setShowXpGuide(true)}
                    onBlur={() => setShowXpGuide(false)}
                    onClick={() => setShowXpGuide((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/35 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-400/20 transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>¿Cómo ganar XP?</span>
                  </button>

                  <AnimatePresence>
                    {showXpGuide && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full mt-2 z-30 w-72 sm:w-80 rounded-2xl border border-cyan-400/40 bg-[#0B101B] p-4 shadow-2xl text-left space-y-2"
                      >
                        <p className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Cómo sumar XP y subir tu nivel de estudio
                        </p>
                        <ul className="space-y-1.5 text-[11px] font-sans text-zinc-300">
                          <li className="flex justify-between gap-2">
                            <span>Tocar una palabra clave del versículo</span>
                            <strong className="font-mono text-cyan-300 shrink-0">+25 XP</strong>
                          </li>
                          <li className="flex justify-between gap-2">
                            <span>Completar Aplicación Práctica</span>
                            <strong className="font-mono text-cyan-300 shrink-0">+50 XP</strong>
                          </li>
                          <li className="flex justify-between gap-2">
                            <span>Ganar cada minijuego (5 modos)</span>
                            <strong className="font-mono text-coral-300 shrink-0">+150 a +280 XP</strong>
                          </li>
                          <li className="flex justify-between gap-2">
                            <span>Repasar juegos ya completados</span>
                            <strong className="font-mono text-cyan-200 shrink-0">+45% XP extra</strong>
                          </li>
                          <li className="flex justify-between gap-2">
                            <span>Duelo 1v1 / Semana de Gracia / Final</span>
                            <strong className="font-mono text-white shrink-0">+200 a +500 XP</strong>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Lista de Jugadores */}
            <div className="space-y-3">
              {players.map((player, index) => {
                const isSelf = player.id === currentPlayer.playerId;
                const rank = getPlayerRank(player.xp);
                const position = index + 1;

                return (
                  <div
                    key={player.id}
                    className={`rounded-2xl border p-4 transition ${
                      isSelf
                        ? 'border-cyan-400/60 bg-cyan-400/[0.08]'
                        : position === 1
                          ? 'border-coral-400/45 bg-coral-400/[0.06]'
                          : 'border-white/10 bg-zinc-950/70'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm shrink-0 border ${
                            position === 1
                              ? 'bg-coral-400 text-zinc-950 border-coral-300'
                              : position === 2
                                ? 'bg-cyan-400 text-zinc-950 border-cyan-300'
                                : position === 3
                                  ? 'bg-white text-zinc-950 border-white'
                                  : 'bg-zinc-900 text-zinc-300 border-white/10'
                          }`}
                        >
                          {position === 1 ? <Crown className="w-5 h-5" /> : `#${position}`}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-extrabold text-white text-base truncate">
                              {player.name}
                            </span>
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                                Tú
                              </span>
                            )}
                          </div>
                          <span className={`text-xs font-mono ${rank.current.color}`}>
                            {rank.current.badge} {rank.current.title}
                          </span>
                        </div>
                      </div>

                      <div
                        className="relative text-right shrink-0 cursor-help"
                        onMouseEnter={() => setHoveredPlayerXpId(player.id)}
                        onMouseLeave={() => setHoveredPlayerXpId(null)}
                      >
                        <div className="font-mono text-lg sm:text-xl font-extrabold text-cyan-400 tabular-nums underline decoration-dotted decoration-cyan-400/40 underline-offset-4">
                          {player.xp.toLocaleString('es-ES')} XP
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400">
                          {player.masteredCount}/4 guardados
                          {player.finaleBestScore > 0 ? ` · Final ${player.finaleBestScore}%` : ''}
                        </div>

                        <AnimatePresence>
                          {hoveredPlayerXpId === player.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.14 }}
                              className="absolute right-0 top-full mt-2 z-30 w-64 rounded-xl border border-cyan-400/40 bg-[#0B101B] p-3 shadow-2xl text-left text-[11px] leading-relaxed text-zinc-200 pointer-events-none"
                            >
                              <p className="font-mono font-bold text-cyan-300 mb-1">
                                Desglose de XP · {player.name}
                              </p>
                              <p>
                                Suma XP tocando palabras clave (+25), retos prácticos (+50), los 5 juegos (+150 a +280) y repasando para subir cada semana hasta <strong>Maestro 119:9</strong> (650+ XP).
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Medidor de estudio de los 4 versículos para este jugador */}
                    <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {niveles.map((lvl) => {
                        const unlocked = leaderUnlockAll || isWeekDateUnlocked(lvl, effectiveTodayKey);
                        const vXp = Number(player.verseXp?.[lvl.id] || player.verseXp?.[String(lvl.id)] || 0);
                        const study = getVerseStudyStatus(vXp);
                        const cellKey = `${player.id}-${lvl.id}`;
                        const isCellHovered = hoveredCellKey === cellKey;

                        return (
                          <div
                            key={lvl.id}
                            onMouseEnter={() => unlocked && setHoveredCellKey(cellKey)}
                            onMouseLeave={() => setHoveredCellKey(null)}
                            className="relative rounded-xl bg-zinc-900/75 border border-white/5 px-2.5 py-2 text-[11px] transition hover:border-cyan-400/35"
                          >
                            <div className="flex items-center justify-between gap-1 font-mono">
                              <span className="text-zinc-400">Sem {lvl.id}</span>
                              {unlocked ? (
                                <span className="text-white font-bold">{vXp} XP</span>
                              ) : (
                                <Lock className="w-3 h-3 text-zinc-500" />
                              )}
                            </div>
                            <p className="mt-0.5 font-semibold truncate text-zinc-200">
                              {unlocked ? study.current.label : 'Cerrada'}
                            </p>
                            {unlocked && (
                              <div className="mt-1 h-1 rounded-full bg-zinc-950 overflow-hidden">
                                <div
                                  className={`h-full ${study.current.barClass}`}
                                  style={{ width: `${study.progressPercent}%` }}
                                />
                              </div>
                            )}

                            <AnimatePresence>
                              {unlocked && isCellHovered && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute left-0 bottom-full mb-2 z-30 w-52 rounded-xl border border-coral-400/40 bg-[#0B101B] p-2.5 shadow-2xl text-[10px] leading-snug text-zinc-200 pointer-events-none"
                                >
                                  <p className="font-mono font-bold text-coral-300">
                                    {lvl.nombre}
                                  </p>
                                  <p className="mt-0.5">
                                    {study.next
                                      ? `${vXp} XP · Faltan ${study.xpToNext} XP jugando o repasando para «${study.next.label}».`
                                      : `${vXp} XP · ¡Nivel máximo Maestro 119:9 alcanzado!`}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {players.length === 0 && !loading && (
                <div className="text-center py-8 text-xs font-mono text-zinc-400">
                  Aún no hay jugadores registrados. ¡Juega un reto para estrenar el Ranking!
                </div>
              )}
            </div>

            {/* Opción para cambiar de jugador si comparten dispositivo */}
            <div className="pt-3 border-t border-white/10">
              {switching ? (
                <form onSubmit={handleSwitchSubmit} className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    maxLength={40}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre del nuevo jugador..."
                    className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-400 text-zinc-950 font-extrabold text-xs disabled:opacity-40"
                  >
                    Empezar con 0 XP
                  </button>
                  <button
                    type="button"
                    onClick={() => setSwitching(false)}
                    className="px-3 py-2 rounded-xl bg-white/5 text-xs text-zinc-300"
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSwitching(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>¿Juega otra persona en este mismo móvil? Registrar nuevo jugador</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
