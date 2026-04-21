import { voiceConfig } from '../config/voice';

interface AudioCache {
  [text: string]: HTMLAudioElement;
}

class PollyService {
  private audioCache: AudioCache = {};
  private maxCacheSize = 50;
  private currentAudio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;
  private currentRequestId: number = 0;

  isAvailable(): boolean {
    return voiceConfig.provider === 'polly';
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

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.abortController?.abort();
    this.abortController = null;
  }

  /**
   * Speak text using Polly. 
   * Note: Requires API proxy (e.g., Lambda) for actual Polly integration.
   */
  async speak(text: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Polly provider is not selected');
    }

    this.currentRequestId++;
    const requestId = this.currentRequestId;
    this.stop();
    this.abortController = new AbortController();

    const cached = this.getFromCache(text);
    if (cached) {
      if (requestId !== this.currentRequestId) return;
      this.currentAudio = cached;
      cached.currentTime = 0;
      try {
        await cached.play();
        return;
      } catch (e) {
        console.warn('Cached audio playback failed, re-fetching', e);
      }
    }

    try {
      const audio = await this.fetchAudio(text, this.abortController.signal);
      if (requestId !== this.currentRequestId) return;
      this.addToCache(text, audio);
      this.currentAudio = audio;
      return audio.play();
    } catch (error) {
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        console.debug('Polly request cancelled');
        return;
      }
      console.error('Polly service error:', error);
      throw error; // Propagate for utility fallback
    }
  }

  /**
   * Fetch audio from Polly API.
   */
  private async fetchAudio(text: string, signal?: AbortSignal): Promise<HTMLAudioElement> {
    const apiEndpoint = voiceConfig.apiEndpoint || '/api/polly/speak';
    
    // Add a 5s timeout to avoid blocking the UI forever
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), 5000);

    // If external signal is provided, link it to our timeout controller
    if (signal) {
      signal.addEventListener('abort', () => timeoutController.abort());
    }

    try {
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
        signal: timeoutController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Polly API error (${response.status}): ${errorData.message || response.statusText}`);
      }

      let audioBlob: Blob;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!data.audioBase64) {
          throw new Error('Invalid response format: missing audioBase64');
        }
        
        // Convert base64 to Blob
        const binaryStr = window.atob(data.audioBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      } else {
        audioBlob = await response.blob();
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return new Promise((resolve, reject) => {
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = () => reject(new Error('Audio resource failed to load'));
        
        // Safety timeout for audio load
        setTimeout(() => reject(new Error('Audio load timeout')), 3000);
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Polly API request timed out or cancelled');
      }
      throw error;
    }
  }
}

export const pollyService = new PollyService();