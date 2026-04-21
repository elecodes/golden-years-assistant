export interface VoiceConfig {
  provider: 'polly' | 'browser';
  pollyVoice: 'Matthew' | 'Joanna';
  awsRegion: string;
  apiEndpoint: string;
  fallbackToBrowser: boolean;
}

export const voiceConfig: VoiceConfig = {
  provider: (import.meta.env.VITE_VOICE_PROVIDER as 'polly' | 'browser') || 'browser',
  pollyVoice: (import.meta.env.VITE_POLLY_VOICE as 'Matthew' | 'Joanna') || 'Joanna',
  awsRegion: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  apiEndpoint: import.meta.env.VITE_POLLY_API_ENDPOINT || '',
  fallbackToBrowser: true, // Always allow fallback for better UX
};

/**
 * Checks if the Polly endpoint is configured and looks like a valid URL.
 */
export const isEndpointConfigured = (): boolean => {
  if (!voiceConfig.apiEndpoint) return false;
  try {
    new URL(voiceConfig.apiEndpoint);
    return true;
  } catch {
    return false;
  }
};