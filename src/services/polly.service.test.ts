import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pollyService } from './polly.service';

vi.mock('../config/voice', () => ({
  voiceConfig: {
    provider: 'polly',
    apiEndpoint: '/api/polly/speak',
    pollyVoice: 'Joanna'
  }
}));

describe('PollyService Cancellation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    pollyService.stop();
    
    // Mock global fetch
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
    
    // Mock global Audio
    globalThis.Audio = class {
      play = vi.fn().mockResolvedValue(undefined);
      pause = vi.fn();
      currentTime = 0;
      oncanplaythrough: (() => void) | null = null;
      onerror: ((ev: string | Event) => void) | null = null;
      
      constructor() {
        setTimeout(() => {
          if (this.oncanplaythrough) this.oncanplaythrough();
        }, 10);
      }
    } as unknown as typeof Audio;
    
    // Mock URL.createObjectURL
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
  });

  it('should cancel previous fetch request when a new speak call is made', async () => {
    const abortSignals: AbortSignal[] = [];
    
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation((_url: string, options: RequestInit) => {
      abortSignals.push(options.signal as AbortSignal);
      return new Promise((resolve) => {
        // Simulate a slow request
        setTimeout(() => {
          resolve({
            ok: true,
            headers: new Map([['content-type', 'audio/mpeg']]),
            blob: () => Promise.resolve(new Blob()),
            json: () => Promise.resolve({})
          });
        }, 100);
      });
    });

    // First call
    const firstSpeak = pollyService.speak('First message');
    
    // Second call immediately after
    // Use a tiny delay to ensure first speak reaches fetch
    await new Promise(resolve => setTimeout(resolve, 0));
    const secondSpeak = pollyService.speak('Second message');

    expect(abortSignals.length).toBeGreaterThan(0);
    expect(abortSignals[0].aborted).toBe(true);
    
    await secondSpeak;
    await firstSpeak;
  });

  it('should not play audio if the request was superseded by a newer one', async () => {
    const playSpy = vi.fn().mockResolvedValue(undefined);
    
    globalThis.Audio = class {
      play = playSpy;
      pause = vi.fn();
      currentTime = 0;
      oncanplaythrough: (() => void) | null = null;
      onerror: ((ev: string | Event) => void) | null = null;
      
      constructor() {
        setTimeout(() => {
          if (this.oncanplaythrough) this.oncanplaythrough();
        }, 10);
      }
    } as unknown as typeof Audio;
    
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return {
        ok: true,
        headers: new Map([['content-type', 'audio/mpeg']]),
        blob: () => Promise.resolve(new Blob())
      };
    });

    // Start first request
    const firstSpeak = pollyService.speak('Message 1');
    // Start second request shortly after
    await new Promise(resolve => setTimeout(resolve, 10));
    const secondSpeak = pollyService.speak('Message 2');

    await firstSpeak;
    await secondSpeak;

    // The first request should have been ignored, 
    // so play should only be called once for the second message.
    expect(playSpy).toHaveBeenCalledTimes(1);
  });
});
