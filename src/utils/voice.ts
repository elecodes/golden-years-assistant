import { voiceConfig } from '../config/voice';
import { pollyService } from '../services/polly.service';

const speakBrowser = (text: string, rate: number = 0.85) => {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Premium Voice Hunter: Look for high-quality/neural voices
  const voices = window.speechSynthesis.getVoices();
  
  // Prioritize neural/natural voices often found in Chrome/Safari
  const premiumVoice = voices.find((v) => 
    v.lang.startsWith('en') && 
    (v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Enhanced'))
  );

  const fallbackEnglishVoice = voices.find((v) => v.lang.startsWith('en'));
  
  if (premiumVoice) {
    utterance.voice = premiumVoice;
    console.debug('Using premium browser voice:', premiumVoice.name);
  } else if (fallbackEnglishVoice) {
    utterance.voice = fallbackEnglishVoice;
    console.debug('Using fallback browser voice:', fallbackEnglishVoice.name);
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  pollyService.stop();
};

let currentSpeechId = 0;

export const speak = async (text: string, rate: number = 0.85) => {
  const speechId = ++currentSpeechId;
  stopSpeech();
  
  const usePolly = voiceConfig.provider === 'polly' && pollyService.isAvailable();

  if (usePolly) {
    try {
      await pollyService.speak(text);
      return;
    } catch (error) {
      console.warn('AWS Polly failed, falling back to Browser TTS:', error);
    }
  }
  
  // If a newer speech request has been made, don't trigger the fallback browser TTS
  if (speechId !== currentSpeechId) return;
  
  // Fallback to browser TTS if Polly failed or is disabled
  speakBrowser(text, rate);
};

export const announceAction = (action: string) => {
  speak(action);
};
