let voices: SpeechSynthesisVoice[] = [];
let audioContextResumed = false;

const loadVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) {
      voices = window.speechSynthesis.getVoices();
      return resolve();
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve();
    };
  });
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
}

export const getVoices = () => voices;

export const resumeAudioContext = () => {
  if (window.speechSynthesis && !audioContextResumed) {
    window.speechSynthesis.resume();
    audioContextResumed = true;
  }
};
