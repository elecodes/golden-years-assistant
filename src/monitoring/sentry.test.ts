import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as SentryModule from '@sentry/browser';

vi.mock('@sentry/browser', () => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => 'browserTracing'),
  replayIntegration: vi.fn(() => 'replay'),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  SeverityLevel: {
    Info: 'info',
    Warning: 'warning',
    Error: 'error',
  },
}));

describe('Sentry monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('captureError', () => {
    it('should capture error to Sentry when DSN is configured', async () => {
      vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123');
      
      const { captureError } = await import('./sentry');
      const error = new Error('Test error');
      const context = { userId: '123' };

      captureError(error, context);

      expect(SentryModule.captureException).toHaveBeenCalledWith(error, {
        extra: context,
      });
    });
  });

  describe('captureMessage', () => {
    it('should capture message to Sentry', async () => {
      vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123');
      
      const { captureMessage } = await import('./sentry');
      captureMessage('Test message', 'info');

      expect(SentryModule.captureMessage).toHaveBeenCalledWith('Test message', 'info');
    });

    it('should default to info level', async () => {
      vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123');
      
      const { captureMessage } = await import('./sentry');
      captureMessage('Test message');

      expect(SentryModule.captureMessage).toHaveBeenCalledWith('Test message', 'info');
    });
  });
});
