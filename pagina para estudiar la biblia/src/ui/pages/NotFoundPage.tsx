import { Link } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center text-center">
      <p className="font-serif text-6xl text-ember-500">404</p>
      <h1 className="mt-3 font-serif text-2xl text-navy-900 dark:text-parchment-50">{t('common.error')}</h1>
      <Link to={ROUTES.dashboard} className="sv-btn sv-btn-primary mt-6">
        {t('nav.home')}
      </Link>
    </div>
  );
}
