import * as Sentry from '@sentry/browser';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENV = import.meta.env.VITE_APP_ENV || 'development';

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENV,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Captured error (Sentry disabled):', error, context);
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level}] ${message}`);
  }
}

export function setUserContext(user: { id: string; email?: string; username?: string }) {
  if (SENTRY_DSN) {
    Sentry.setUser(user);
  }
}

export function clearUserContext() {
  if (SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

export { Sentry };
