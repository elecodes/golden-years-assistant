import { useState } from 'react';
import { Phone, Check, X } from 'lucide-react';
import { speak } from '../utils/voice';

export const EmergencyButton: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleHelpClick = () => {
    setIsConfirming(true);
    speak("You are about to call for help. Press Yes to confirm.");
  };

  const handleConfirm = () => {
    setIsConfirming(false);
    speak("Calling family and emergency services now.");
    alert("EMERGENCY CALL TRIGGERED");
  };

  const handleCancel = () => {
    setIsConfirming(false);
    speak("Emergency call cancelled.");
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isConfirming ? (
        <button
          onClick={handleHelpClick}
          className="btn-emergency shadow-xl animate-pulse flex items-center gap-3 px-8"
          aria-label="Call for Help"
        >
          <Phone className="w-8 h-8" />
          <span className="text-2xl">Call for Help</span>
        </button>
      ) : (
        <div className="bg-white border-4 border-emergency-red p-6 rounded-2xl shadow-2xl flex flex-col gap-6 max-w-sm">
          <p className="text-2xl font-bold text-center">Confirm Help Call?</p>
          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 text-white rounded-xl py-8 flex flex-col items-center gap-2"
            >
              <Check className="w-10 h-10" />
              <span className="text-2xl font-bold">YES</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-slate-200 text-slate-800 rounded-xl py-8 flex flex-col items-center gap-2"
            >
              <X className="w-10 h-10" />
              <span className="text-2xl font-bold">NO</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
