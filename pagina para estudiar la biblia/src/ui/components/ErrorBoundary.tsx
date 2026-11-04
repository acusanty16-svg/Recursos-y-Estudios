import { Component, type ErrorInfo, type ReactNode } from 'react';
import { translate } from '@i18n';

interface Props {
  readonly children: ReactNode;
  readonly language: 'es' | 'en';
}

interface State {
  readonly hasError: boolean;
}

/** Barrera de errores: evita que un JSON corrupto tumbe toda la SPA. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Santi\'s Versicles] Error no controlado', error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="sv-card max-w-md text-center">
          <h1 className="font-serif text-2xl text-navy-900 dark:text-parchment-50">
            {translate(this.props.language, 'error.boundaryTitle')}
          </h1>
          <p className="mt-3 text-sm text-navy-600 dark:text-parchment-200">
            {translate(this.props.language, 'error.boundaryBody')}
          </p>
          <button
            type="button"
            className="sv-btn sv-btn-primary mt-6"
            onClick={() => window.location.reload()}
          >
            {translate(this.props.language, 'error.reload')}
          </button>
        </div>
      </div>
    );
  }
}
