export const voiceFeatureConfig = {
  enabled: import.meta.env.VITE_VOICE_PROVIDER === 'polly',
  defaultProvider: 'browser' as const,
  PollyProvider: 'polly' as const,
};