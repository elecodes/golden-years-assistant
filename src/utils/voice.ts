import { voiceConfig } from '../config/voice';
import { pollyService } from '../services/polly.service';

const speakBrowser = (text: string, rate: number = 0.75) => {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find((v) => v.lang.startsWith('en'));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const speak = async (text: string, rate: number = 0.75) => {
  if (voiceConfig.provider === 'polly' && pollyService.isAvailable()) {
    try {
      await pollyService.speak(text);
      return;
    } catch {
      // Fall through to browser TTS
    }
  }
  
  // Fallback to browser TTS
  speakBrowser(text, rate);
};

export const announceAction = (action: string) => {
  speak(action);
};
