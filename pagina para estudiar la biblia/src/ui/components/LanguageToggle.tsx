import { useAppStore } from '@controller/store';
import { updatePreferences } from '@controller/preferences.controller';
import { GlobeIcon } from './icons';

export function LanguageToggle({ compact = false }: { readonly compact?: boolean }) {
  const { preferences } = useAppStore();
  const next = preferences.uiLanguage === 'es' ? 'en' : 'es';

  return (
    <button
      type="button"
      className="sv-btn sv-btn-ghost"
      aria-label={preferences.uiLanguage === 'es' ? 'Switch to English' : 'Cambiar a español'}
      title={preferences.uiLanguage === 'es' ? 'Switch to English' : 'Cambiar a español'}
      onClick={() => updatePreferences({ uiLanguage: next })}
    >
      <GlobeIcon size={18} />
      <span className={compact ? 'text-xs font-semibold uppercase' : 'text-sm font-medium'}>
        {preferences.uiLanguage.toUpperCase()}
      </span>
    </button>
  );
}
