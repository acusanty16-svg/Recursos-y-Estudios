import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClubLampProvider, useClubLamp } from './context/ClubLampContext.jsx';
import PortalSelector from './components/shared/PortalSelector.jsx';
import KidsLayout from './components/kids/KidsLayout.jsx';
import GeneralLayout from './components/general/GeneralLayout.jsx';

function ClubLampExperienceRouter() {
  const { activeMode } = useClubLamp();

  return (
    <AnimatePresence mode="wait">
      {activeMode === 'kids' && (
        <motion.div
          key="kids-experience"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <KidsLayout />
        </motion.div>
      )}

      {activeMode === 'general' && (
        <motion.div
          key="general-experience"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <GeneralLayout />
        </motion.div>
      )}

      {!activeMode && (
        <motion.div
          key="portal-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PortalSelector />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ClubLampProvider>
      <ClubLampExperienceRouter />
    </ClubLampProvider>
  );
}
