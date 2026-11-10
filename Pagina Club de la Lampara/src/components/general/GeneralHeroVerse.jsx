import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BookOpen,
  Volume2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Send,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import { speakText } from '../../utils/motionConfig.js';

export default function GeneralHeroVerse({
  selectedVerse,
  assignedVerseId,
  onSelectVerse,
  versesList = [],
}) {
  const {
    currentLevelMeta,
    isVerseLearned,
    toggleLearnedVerse,
    selectLevel,
    levels,
  } = useClubLamp();

  const [recitationMode, setRecitationMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reinicia el modo recitación al cambiar de versículo
  useEffect(() => {
    setRecitationMode(false);
  }, [selectedVerse?.id]);

  if (!selectedVerse) return null;

  const delivered = isVerseLearned(selectedVerse.id);
  const isAssignedThisWeek = selectedVerse.id === assignedVerseId;
  const weekNumber = selectedVerse.semana || ((selectedVerse.orden - 1) % 8) + 1;

  const currentIndex = versesList.findIndex((v) => v.id === selectedVerse.id);
  const prevVerse = currentIndex > 0 ? versesList[currentIndex - 1] : null;
  const nextVerse =
    currentIndex >= 0 && currentIndex < versesList.length - 1
      ? versesList[currentIndex + 1]
      : null;

  const hasNextLevel =
    currentLevelMeta &&
    currentLevelMeta.id !== 'all' &&
    currentLevelMeta.id < levels.length;

  const handleCopyVerse = async () => {
    const textToCopy = `"${selectedVerse.texto}" — ${selectedVerse.referencia} (Nivel ${selectedVerse.nivel}, Semana ${weekNumber} · Club de la Lámpara)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignorar si el navegador bloquea el portapapeles
    }
  };

  // Consejo 1: Enviar directamente al encargado por WhatsApp
  const handleSendWhatsApp = () => {
    const message =
      `Hola, entrego el versículo correspondiente a la *Semana ${weekNumber} del Nivel ${selectedVerse.nivel}* del Club de la Lámpara:\n\n` +
      `📖 *${selectedVerse.referencia}* (${selectedVerse.titulo})\n` +
      `«${selectedVerse.texto}»`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLevelApprovalWhatsApp = () => {
    if (!currentLevelMeta) return;
    const message =
      `✅ *Club de la Lámpara · Nivel Superado*\n` +
      `He completado las 8 semanas correspondientes al *${currentLevelMeta.nombre}* (8/8 versículos entregados). Solicito validación para avanzar al siguiente nivel.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="space-y-4">
      {/* WARNING OFICIAL EN LA CABECERA DEL CONTENIDO */}
      <div
        role="alert"
        className="rounded-2xl bg-amber-950 text-amber-50 border-2 border-amber-400/90 p-3.5 sm:p-4 shadow-md"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center shrink-0">
            <motion.div
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </motion.div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                Normativa Semanal Obligatoria
              </span>
              <span className="text-xs sm:text-sm font-bold text-white">
                Entrega al Encargado cada Semana
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-snug">
              El versículo de la semana debe enviarse al encargado correspondiente cada semana para avanzar de nivel.{' '}
              <strong className="text-amber-300 underline decoration-amber-400/70">
                Si no se logra, se dará como suspenso el nivel y habrá que repetirlo.
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* CONSEJO 5: CERTIFICADO OFICIAL DE NIVEL SUPERADO (8/8 SEMANAS) */}
      {currentLevelMeta && currentLevelMeta.isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-2 border-emerald-400 p-5 sm:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
                Nivel Superado · 8 de 8 Semanas Entregadas
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {currentLevelMeta.nombre} — Apto para Avanzar
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90">
                Has completado las 8 entregas semanales de este nivel. Ya tienes desbloqueado el acceso al siguiente nivel.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleShareLevelApprovalWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Notificar Nivel Completado</span>
            </button>

            {hasNextLevel && (
              <button
                type="button"
                onClick={() => selectLevel(currentLevelMeta.id + 1)}
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <span>Avanzar al Nivel {currentLevelMeta.id + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* HERO PRINCIPAL: EL VERSÍCULO DE LA SEMANA ARRIBA DEL TODO CON COLOR DE ÉNFASIS */}
      <div
        className={`relative rounded-3xl overflow-hidden transition-all shadow-xl ${
          isAssignedThisWeek
            ? 'bg-slate-900 text-white border-[3px] border-amber-400 shadow-amber-500/10'
            : 'bg-slate-900 text-white border-2 border-slate-700'
        }`}
      >
        {/* Franja superior de énfasis para el Versículo Asignado de la Semana */}
        <div
          className={`px-4 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider ${
            isAssignedThisWeek
              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950'
              : 'bg-slate-800 text-slate-200 border-b border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              {isAssignedThisWeek
                ? `Versículo Asignado de la Semana · Semana ${weekNumber} (Nivel ${selectedVerse.nivel})`
                : `Visualizando Semana ${weekNumber} · Nivel ${selectedVerse.nivel}`}
            </span>
          </div>

          <span className="font-mono text-[11px] opacity-85">
            Versículo #{String(selectedVerse.orden).padStart(2, '0')} de 48
          </span>
        </div>

        {/* Contenido principal del Hero del Versículo */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Encabezado: Cita Bíblica, Título y Botón de Modo Recitación (Consejo 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-base sm:text-lg font-extrabold text-amber-400 tracking-wide">
                  {selectedVerse.referencia}
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                  {selectedVerse.categoria}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-3xl font-semibold text-white">
                {selectedVerse.titulo}
              </h1>
            </div>

            {/* Consejo 2: Interruptor sobrio de "Ocultar texto para recitar" */}
            <button
              type="button"
              onClick={() => setRecitationMode((prev) => !prev)}
              className={`self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all shrink-0 ${
                recitationMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-amber-200 border-slate-700'
              }`}
            >
              {recitationMode ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Mostrar texto bíblico</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  <span>Ocultar texto para recitar</span>
                </>
              )}
            </button>
          </div>

          {/* Caja del Texto Bíblico: se difumina limpio como antes y muestra solo el botón de flecha/ojo sin texto encima */}
          <div
            onClick={() => recitationMode && setRecitationMode(false)}
            className={`rounded-2xl p-5 sm:p-7 border-2 transition-all ${
              isAssignedThisWeek
                ? 'bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-slate-900 border-amber-400/70'
                : 'bg-slate-950/60 border-slate-800'
            } ${recitationMode ? 'cursor-pointer group' : ''}`}
          >
            <div className="relative py-2">
              <blockquote
                className={`font-serif text-xl sm:text-2xl lg:text-3xl text-amber-50 leading-relaxed transition-all duration-300 ${
                  recitationMode ? 'blur-md select-none opacity-30' : ''
                }`}
              >
                «{selectedVerse.texto}»
              </blockquote>

              {recitationMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    title="Ver versículo"
                    className="w-12 h-12 rounded-full bg-amber-400 group-hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </div>
              )}
            </div>

            {/* Pie del recuadro siempre fuera de la zona difuminada */}
            <div className="mt-5 pt-3.5 border-t border-amber-400/20 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-300/90 font-semibold">
              <span>
                Semana {weekNumber} · Nivel {selectedVerse.nivel}
              </span>
              <span>— {selectedVerse.referencia} (RVR1960)</span>
            </div>
          </div>

          {/* Contexto Doctrinal y Términos Clave */}
          {selectedVerse.contexto && (
            <div className="bg-slate-950/50 rounded-2xl p-4 sm:p-5 border border-slate-800/90 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Enseñanza y Contexto Doctrinal</span>
                </span>
                {selectedVerse.palabrasClave?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVerse.palabrasClave.slice(0, 5).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedVerse.contexto}
              </p>
            </div>
          )}

          {/* Botonera Principal: Enviar por WhatsApp al Encargado (Consejo 1), Marcar Entregado, Copiar, Audio */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Consejo 1: Botón WhatsApp */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Enviar al Encargado (WhatsApp)</span>
              </button>

              {/* Marcar Semana Entregada */}
              <button
                type="button"
                onClick={() => toggleLearnedVerse(selectedVerse.id)}
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition-colors ${
                  delivered
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'
                }`}
              >
                {delivered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Semana {weekNumber} Entregada</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Marcar Semana Entregada</span>
                  </>
                )}
              </button>
            </div>

            {/* Acciones secundarias: Audio y Copiar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  speakText(`${selectedVerse.referencia}. ${selectedVerse.texto}`, 0.92)
                }
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Escuchar</span>
              </button>

              <button
                type="button"
                onClick={handleCopyVerse}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navegación rápida entre las 8 semanas directamente desde el Hero */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
            <button
              type="button"
              disabled={!prevVerse}
              onClick={() => prevVerse && onSelectVerse(prevVerse)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none text-slate-300 font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="truncate max-w-[130px] sm:max-w-none">
                {prevVerse ? `Semana ${prevVerse.semana || currentIndex}: ${prevVerse.referencia}` : 'Inicio del nivel'}
              </span>
            </button>

            <button
              type="button"
              disabled={!nextVerse}
              onClick={() => nextVerse && onSelectVerse(nextVerse)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none text-slate-300 font-semibold flex items-center gap-1"
            >
              <span className="truncate max-w-[130px] sm:max-w-none">
                {nextVerse ? `Semana ${nextVerse.semana || currentIndex + 2}: ${nextVerse.referencia}` : 'Fin del nivel'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
