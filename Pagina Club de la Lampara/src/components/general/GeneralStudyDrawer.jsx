import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import { speakText } from '../../utils/motionConfig.js';

// Ficha de Lectura y Estudio Doctrinal (Sin juegos ni ocultación, tono serio y maduro)
export default function GeneralStudyDrawer({
  verse,
  onSelectVerse,
  versesList = [],
}) {
  const { isVerseLearned, toggleLearnedVerse } = useClubLamp();
  const [copied, setCopied] = useState(false);

  if (!verse) return null;

  const delivered = isVerseLearned(verse.id);
  const weekNumber = verse.semana || ((verse.orden - 1) % 8) + 1;

  const currentIndex = versesList.findIndex((v) => v.id === verse.id);
  const prevVerse = currentIndex > 0 ? versesList[currentIndex - 1] : null;
  const nextVerse =
    currentIndex >= 0 && currentIndex < versesList.length - 1
      ? versesList[currentIndex + 1]
      : null;

  const handleCopyVerse = async () => {
    const textToCopy = `"${verse.texto}" — ${verse.referencia} (Nivel ${verse.nivel}, Semana ${weekNumber} · Club de la Lámpara)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignorar si el navegador bloquea el portapapeles
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-general-card overflow-hidden">
      {/* Cabecera de la Ficha Semanal */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold">
              Nivel {verse.nivel} · Semana {weekNumber}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {verse.categoria}
            </span>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Versículo #{String(verse.orden).padStart(2, '0')} de 48
          </span>
        </div>

        <p className="text-sm font-semibold text-amber-400 mb-1">
          {verse.referencia}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white leading-snug">
          {verse.titulo}
        </h2>
      </div>

      {/* Cuerpo de Lectura y Estudio */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Texto Bíblico Íntegro en Tipografía Editorial */}
        <div className="p-6 sm:p-8 rounded-2xl bg-parchment-50 border border-stone-200/90">
          <blockquote className="font-serif text-xl sm:text-2xl lg:text-[26px] text-slate-900 leading-relaxed mb-4">
            «{verse.texto}»
          </blockquote>
          <p className="text-right text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800">
            — {verse.referencia} (RVR1960)
          </p>
        </div>

        {/* Barra de Utilidades de Estudio (Audio, Copiar para enviar al encargado, Estado de Entrega) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-2 border-b border-stone-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => speakText(`${verse.referencia}. ${verse.texto}`, 0.92)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Escuchar lectura</span>
            </button>

            <button
              type="button"
              onClick={handleCopyVerse}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800">Copiado al portapapeles</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-600" />
                  <span>Copiar texto y cita</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => toggleLearnedVerse(verse.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-colors ${
              delivered
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white'
            }`}
          >
            {delivered ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Semana {weekNumber} entregada al encargado</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Marcar como entregado al encargado</span>
              </>
            )}
          </button>
        </div>

        {/* Comentario Doctrinal y Contexto Bíblico */}
        {verse.contexto && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Contexto Bíblico y Enseñanza Doctrinal</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-stone-50/80 p-4 rounded-xl border border-stone-200/80">
              {verse.contexto}
            </p>
          </div>
        )}

        {/* Términos Clave del Pasaje */}
        {verse.palabrasClave && verse.palabrasClave.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Términos Clave para Meditación y Estudio
            </h4>
            <div className="flex flex-wrap gap-2">
              {verse.palabrasClave.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-semibold text-slate-700"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recordatorio de entrega semanal de la ficha */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Requisito de la Semana {weekNumber} (Nivel {verse.nivel}):</strong> Recuerda presentar este versículo a tu encargado asignado antes de finalizar la semana. Para aprobar el Nivel {verse.nivel} es indispensable completar las 8 semanas sin faltas; de lo contrario, el nivel quedará suspenso y deberá repetirse.
          </p>
        </div>

        {/* Navegación entre Semanas del Nivel */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200/80">
          <button
            type="button"
            disabled={!prevVerse}
            onClick={() => prevVerse && onSelectVerse(prevVerse)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior ({prevVerse ? prevVerse.referencia : 'Inicio'})</span>
          </button>

          <button
            type="button"
            disabled={!nextVerse}
            onClick={() => nextVerse && onSelectVerse(nextVerse)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <span>Siguiente ({nextVerse ? nextVerse.referencia : 'Fin'})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
