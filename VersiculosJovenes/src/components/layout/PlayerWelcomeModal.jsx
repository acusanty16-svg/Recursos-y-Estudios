import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, User } from 'lucide-react';
import DesafioBrandMark from './DesafioBrandMark';
import { soundFX } from '../../utils/soundEffects';

export default function PlayerWelcomeModal({ open, onConfirm }) {
  const [name, setName] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundFX.playWin();
    onConfirm(name.trim());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="relative w-full max-w-md rounded-3xl bg-[#090C13] border border-cyan-400/35 shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-5"
        >
          <div className="absolute -top-20 -left-16 w-48 h-48 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-16 w-48 h-48 rounded-full bg-coral-400/15 blur-3xl pointer-events-none" />

          <div className="relative flex justify-center">
            <DesafioBrandMark size={64} />
          </div>

          <div className="relative space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/35 font-mono text-[11px] font-bold text-cyan-300 uppercase">
              <Sparkles className="w-3.5 h-3.5" /> ¡Bienvenido al Reto!
            </span>
            <h2 className="font-display font-extrabold text-3xl tracking-tight">
              <span className="text-cyan-400">DESAFÍO</span>{' '}
              <span className="text-coral-400">119:9</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Escribe tu nombre para guardar tu <strong className="text-white">experiencia (XP)</strong>, ver cuánto dominas cada versículo y aparecer en el Ranking del grupo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-4 text-left">
            <div>
              <label
                htmlFor="welcome-player-name"
                className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
              >
                Tu Nombre o Apodo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="welcome-player-name"
                  type="text"
                  autoFocus
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej.: Sofía Martínez"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/15 text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-coral-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-95 transition shadow-lg"
            >
              <span>Entrar al Desafío</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
