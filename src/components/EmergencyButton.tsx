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
          className="btn-emergency focus-ring shadow-lg flex items-center gap-2 px-5 py-3 min-h-[60px]"
          aria-label="Call for emergency help"
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
          <span className="text-base font-medium">Call for Help</span>
        </button>
      ) : (
        <div 
          className="bg-white border-2 border-red-300 p-5 rounded-xl shadow-xl flex flex-col gap-4 max-w-xs"
          role="alertdialog"
          aria-labelledby="emergency-title"
          aria-describedby="emergency-desc"
        >
          <p id="emergency-title" className="text-lg font-semibold text-center text-slate-800">Confirm Help Call?</p>
          <p id="emergency-desc" className="text-sm text-slate-500 text-center">This will contact your family and emergency services.</p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="focus-ring btn-emergency flex-1 py-4 flex items-center justify-center gap-2 min-h-[70px]"
              aria-label="Confirm emergency call"
            >
              <Check className="w-5 h-5" aria-hidden="true" />
              <span className="text-base font-medium">YES</span>
            </button>
            <button
              onClick={handleCancel}
              className="focus-ring btn-secondary flex-1 py-4 flex items-center justify-center gap-2 min-h-[70px]"
              aria-label="Cancel emergency call"
            >
              <X className="w-5 h-5" aria-hidden="true" />
              <span className="text-base font-medium">NO</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
