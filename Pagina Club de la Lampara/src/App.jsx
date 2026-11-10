import React from 'react';
import { Flame } from 'lucide-react';
import { ClubLampProvider, useClubLamp } from './context/ClubLampContext.jsx';
import PortalSelector from './components/shared/PortalSelector.jsx';
import KidsLayout from './components/kids/KidsLayout.jsx';
import GeneralLayout from './components/general/GeneralLayout.jsx';

function ClubLampExperienceRouter() {
  const { activeMode, isRefreshingMode, viewRefreshKey } = useClubLamp();

  if (isRefreshingMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-200 flex flex-col items-center justify-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3 animate-pulse">
          <Flame className="w-7 h-7 text-amber-400" />
        </div>
        <p className="text-sm font-medium tracking-wide text-amber-100/90">
          Cargando experiencia del Club de la Lámpara...
        </p>
      </div>
    );
  }

  if (activeMode === 'kids') {
    return <KidsLayout key={`kids-${viewRefreshKey}`} />;
  }

  if (activeMode === 'general') {
    return <GeneralLayout key={`general-${viewRefreshKey}`} />;
  }

  return <PortalSelector key={`portal-${viewRefreshKey}`} />;
}

export default function App() {
  return (
    <ClubLampProvider>
      <ClubLampExperienceRouter />
    </ClubLampProvider>
  );
}
