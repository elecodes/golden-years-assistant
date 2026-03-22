import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speak, announceAction } from '../utils/voice';

describe('voice utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('speak', () => {
    it('should not throw when speechSynthesis is not available', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      expect(() => speak('test')).not.toThrow();

      window.speechSynthesis = originalSpeechSynthesis;
    });

    it('should cancel previous speech before speaking', () => {
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

      speak('Hello');

      expect(cancelMock).toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();
    });

    it('should create utterance with correct properties', () => {
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      speak('Test message', 0.8);

      const utterance = speakMock.mock.calls[0][0];
      expect(utterance.text).toBe('Test message');
      expect(utterance.rate).toBe(0.8);
      expect(utterance.pitch).toBe(1);
      expect(utterance.volume).toBe(1);
    });

    it('should use default rate of 0.75', () => {
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      speak('Test');

      const utterance = speakMock.mock.calls[0][0];
      expect(utterance.rate).toBe(0.75);
    });
  });

  describe('announceAction', () => {
    it('should call speak with the action text', () => {
      const speakMock = vi.fn();

      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          cancel: vi.fn(),
          speak: speakMock,
          getVoices: () => [],
        },
        writable: true,
      });

      announceAction('Task completed');

      expect(speakMock).toHaveBeenCalled();
    });
  });
});
