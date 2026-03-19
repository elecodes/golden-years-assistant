import '@testing-library/jest-dom';
import { vi } from 'vitest';

class MockSpeechSynthesisUtterance {
  text: string;
  rate: number = 1;
  pitch: number = 1;
  volume: number = 1;
  lang: string = '';
  onend: (() => void) | null = null;
  onerror: ((event: Error) => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

class MockSpeechSynthesis {
  cancel = vi.fn();
  speak = vi.fn();
  pause = vi.fn();
  resume = vi.fn();
  getVoices = vi.fn(() => []);
  onvoiceschanged: (() => void) | null = null;
}

Object.defineProperty(window, 'speechSynthesis', {
  value: new MockSpeechSynthesis(),
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  writable: true,
  configurable: true,
});
