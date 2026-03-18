import React from 'react';
import { Droplets, Plus, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { speak } from '../utils/voice';

export const HydrationTracker: React.FC = () => {
  const { waterGlasses, addGlass, resetGlasses } = useStore();

  const handleAddGlass = () => {
    if (waterGlasses < 8) {
      addGlass();
      speak(`Good job. That is glass number ${waterGlasses + 1}.`);
    } else {
      speak("You have reached your goal of 8 glasses today. Well done!");
    }
  };

  const handleReset = () => {
    resetGlasses();
    speak("Water count reset for the day.");
  };

  return (
    <div className="card flex flex-col items-center gap-5">
      <div className="flex items-center gap-3 text-slate-600">
        <Droplets className="w-7 h-7" aria-hidden="true" />
        <span className="text-lg font-medium">Water Intake</span>
      </div>

      <div 
        className="relative w-40 h-52 border-2 border-slate-200 rounded-b-2xl overflow-hidden bg-slate-50"
        role="img"
        aria-label={`Water level: ${waterGlasses} out of 8 glasses`}
      >
        <div 
          className="absolute bottom-0 w-full bg-sky-400 transition-all duration-700 ease-in-out"
          style={{ height: `${(waterGlasses / 8) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-semibold text-slate-800" aria-live="polite">
            {waterGlasses}/8
          </span>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={handleAddGlass}
          className="btn-primary focus-ring flex-1 flex items-center gap-2 justify-center py-3 min-h-[60px]"
          aria-label={waterGlasses >= 8 ? "You have reached your daily water goal" : `Add another glass of water. Currently ${waterGlasses} of 8`}
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span className="text-base font-medium">I Drank a Glass</span>
        </button>
        <button
          onClick={handleReset}
          className="focus-ring btn-secondary p-3 min-w-[60px] min-h-[60px] flex items-center justify-center"
          aria-label="Reset water counter to zero"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
