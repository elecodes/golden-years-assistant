import { voiceConfig, awsConfig } from '../config/voice';

interface AudioCache {
  [text: string]: HTMLAudioElement;
}

class PollyService {
  private audioCache: AudioCache = {};
  private maxCacheSize = 50;

  isAvailable(): boolean {
    return !!(
      awsConfig.accessKeyId &&
      awsConfig.secretAccessKey &&
      voiceConfig.provider === 'polly'
    );
  }

  private getCacheKey(text: string): string {
    return text.toLowerCase().trim();
  }

  private getFromCache(text: string): HTMLAudioElement | null {
    const key = this.getCacheKey(text);
    return this.audioCache[key] || null;
  }

  private addToCache(text: string, audio: HTMLAudioElement): void {
    if (Object.keys(this.audioCache).length >= this.maxCacheSize) {
      const firstKey = Object.keys(this.audioCache)[0];
      delete this.audioCache[firstKey];
    }
    const key = this.getCacheKey(text);
    this.audioCache[key] = audio;
  }

  /**
   * Speak text using Polly. 
   * Note: Requires API proxy (e.g., Lambda) for actual Polly integration.
   * This implementation uses direct fetch - will need backend for production.
   */
  async speak(text: string): Promise<void> {
    const cached = this.getFromCache(text);
    if (cached) {
      cached.currentTime = 0;
      return cached.play();
    }

    try {
      const audio = await this.fetchAudio(text);
      this.addToCache(text, audio);
      return audio.play();
    } catch (error) {
      console.warn('Polly failed, falling back to browser TTS:', error);
      throw error;
    }
  }

  /**
   * Fetch audio from Polly API.
   * In production, this should go through an API Gateway/Lambda
   * to avoid exposing AWS credentials in the browser.
   */
  private async fetchAudio(text: string): Promise<HTMLAudioElement> {
    // For development: use mock endpoint or local proxy
    // In production: replace with your API Gateway endpoint
    const apiEndpoint = import.meta.env.VITE_POLLY_API_ENDPOINT || 
      '/api/polly/speak';

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Text: text,
        VoiceId: voiceConfig.pollyVoice,
        Engine: 'neural',
      }),
    });

    if (!response.ok) {
      throw new Error(`Polly API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    return new Promise((resolve, reject) => {
      audio.onended = () => {};
      audio.onerror = () => reject(new Error('Audio playback failed'));
      resolve(audio);
    });
  }
}

export const pollyService = new PollyService();