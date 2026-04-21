import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speak, announceAction } from '../utils/voice';

vi.mock('../services/polly.service', () => ({
  pollyService: {
    stop: vi.fn(),
    speak: vi.fn().mockRejectedValue(new Error('Polly disabled')),
    isAvailable: vi.fn().mockReturnValue(false),
  }
}));

describe('voice utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('speak', () => {
    it('should not throw when speechSynthesis is not available', async () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      await expect(speak('test')).resolves.not.toThrow();

      window.speechSynthesis = originalSpeechSynthesis;
    });

    it('should cancel previous speech before speaking', async () => {
      const cancelMock = vi.fn();
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: cancelMock,
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      await speak('Hello');

      expect(cancelMock).toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();
    });

    it('should create utterance with correct properties', async () => {
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      await speak('Test message', 0.8);

      const utterance = speakMock.mock.calls[0][0];
      expect(utterance.text).toBe('Test message');
      expect(utterance.rate).toBe(0.8);
      expect(utterance.pitch).toBe(1);
      expect(utterance.volume).toBe(1);
    });

    it('should use default rate of 0.85', async () => {
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      await speak('Test');

      const utterance = speakMock.mock.calls[0][0];
      expect(utterance.rate).toBe(0.85);
    });

    it('should prioritize premium voices if available', async () => {
      const speakMock = vi.fn();
      const mockVoices = [
        { name: 'Bad Voice', lang: 'en-US' },
        { name: 'Google US English', lang: 'en-US' },
        { name: 'Samantha', lang: 'en-GB' }
      ] as unknown as SpeechSynthesisVoice[];

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => mockVoices,
        },
        writable: true,
      });

      await speak('Test');

      const utterance = speakMock.mock.calls[0][0];
      expect(utterance.voice.name).toBe('Google US English');
    });
  });

  describe('announceAction', () => {
    it('should call speak with the action text', async () => {
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      await announceAction('Task completed');

      expect(speakMock).toHaveBeenCalled();
    });
  });
});
