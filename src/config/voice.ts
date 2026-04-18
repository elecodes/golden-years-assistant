export interface VoiceConfig {
  provider: 'polly' | 'browser';
  pollyVoice: 'Matthew' | 'Joanna';
  awsRegion: string;
  apiEndpoint: string;
}

export const voiceConfig: VoiceConfig = {
  provider: (import.meta.env.VITE_VOICE_PROVIDER as 'polly' | 'browser') || 'browser',
  pollyVoice: (import.meta.env.VITE_POLLY_VOICE as 'Matthew' | 'Joanna') || 'Joanna',
  awsRegion: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  apiEndpoint: import.meta.env.VITE_POLLY_API_ENDPOINT || '',
};

export const awsConfig = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  region: voiceConfig.awsRegion,
};