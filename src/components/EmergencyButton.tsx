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
          className="btn-emergency focus-ring shadow-xl animate-pulse flex items-center gap-3 px-6 py-4 min-h-[70px] min-w-[180px]"
          aria-label="Call for emergency help"
        >
          <Phone className="w-8 h-8" aria-hidden="true" />
          <span className="text-xl font-bold">Call for Help</span>
        </button>
      ) : (
        <div 
          className="bg-white border-4 border-emergency-red p-6 rounded-2xl shadow-2xl flex flex-col gap-6 max-w-sm"
          role="alertdialog"
          aria-labelledby="emergency-title"
          aria-describedby="emergency-desc"
        >
          <p id="emergency-title" className="text-2xl font-bold text-center">Confirm Help Call?</p>
          <p id="emergency-desc" className="text-lg text-slate-600 text-center">This will contact your family and emergency services.</p>
          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              className="focus-ring flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-8 flex flex-col items-center gap-2 transition-colors duration-200 min-h-[100px]"
              aria-label="Confirm emergency call - Yes"
            >
              <Check className="w-10 h-10" aria-hidden="true" />
              <span className="text-2xl font-bold">YES</span>
            </button>
            <button
              onClick={handleCancel}
              className="focus-ring flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl py-8 flex flex-col items-center gap-2 transition-colors duration-200 min-h-[100px]"
              aria-label="Cancel emergency call - No"
            >
              <X className="w-10 h-10" aria-hidden="true" />
              <span className="text-2xl font-bold">NO</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
