import { useAppStore } from '@controller/store';
import { updatePreferences } from '@controller/preferences.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { MoonIcon, SunIcon } from './icons';

export function ThemeToggle({ compact = false }: { readonly compact?: boolean }) {
  const { preferences } = useAppStore();
  const { t } = useI18n();
  const isDark = preferences.theme === 'dark';

  return (
    <button
      type="button"
      className="sv-btn sv-btn-ghost"
      aria-pressed={isDark}
      aria-label={`${t('settings.theme')}: ${isDark ? t('settings.dark') : t('settings.light')}`}
      title={`${t('settings.theme')}: ${isDark ? t('settings.dark') : t('settings.light')}`}
      onClick={() => updatePreferences({ theme: isDark ? 'light' : 'dark' })}
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      {compact ? null : <span className="hidden sm:inline">{isDark ? t('settings.light') : t('settings.dark')}</span>}
    </button>
  );
}
