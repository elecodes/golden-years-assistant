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
    <div className="card-action flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 text-primary-blue">
        <Droplets className="w-10 h-10" aria-hidden="true" />
        <h2 className="text-3xl font-bold">Water Tracker</h2>
      </div>

      <div 
        className="relative w-48 h-64 border-4 border-primary-blue rounded-b-3xl overflow-hidden bg-slate-50"
        role="img"
        aria-label={`Water level: ${waterGlasses} out of 8 glasses`}
      >
        <div 
          className="absolute bottom-0 w-full bg-blue-400 transition-all duration-700 ease-in-out"
          style={{ height: `${(waterGlasses / 8) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-black text-slate-800 drop-shadow-md" aria-live="polite">
            {waterGlasses}/8
          </span>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={handleAddGlass}
          className="btn-primary focus-ring flex-1 flex items-center gap-3 justify-center py-4 min-h-[70px]"
          aria-label={waterGlasses >= 8 ? "You have reached your daily water goal" : `Add another glass of water. Currently ${waterGlasses} of 8`}
        >
          <Plus className="w-8 h-8" aria-hidden="true" />
          <span className="text-xl font-bold">I Drank a Glass</span>
        </button>
        <button
          onClick={handleReset}
          className="focus-ring bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl p-4 min-w-[70px] min-h-[70px] transition-colors duration-200 flex items-center justify-center"
          aria-label="Reset water counter to zero"
        >
          <RotateCcw className="w-8 h-8" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
