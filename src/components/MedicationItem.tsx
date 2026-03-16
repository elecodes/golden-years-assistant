import { Pill, AlertTriangle } from 'lucide-react';
import type { Medication } from '../store/useStore';
import { useStore } from '../store/useStore';
import { speak } from '../utils/voice';

interface Props {
  medication: Medication;
}

export const MedicationItem: React.FC<Props> = ({ medication }) => {
  const { updateStock, logMedication } = useStore();

  const handleTake = () => {
    if (medication.stock > 0) {
      updateStock(medication.id, -1);
      logMedication(medication.id, 'Taken');
      speak(`Medicine taken. You have ${medication.stock - 1} pills left.`);
      
      if (medication.stock - 1 < 7) {
        speak("Warning: You are running low on this medicine.");
      }
    } else {
      speak("You are out of this medicine. Please call for a refill.");
    }
  };

  const isLowStock = medication.stock < 7;

  return (
    <div className={medication.stock === 0 ? "border-red-500 border-4 rounded-2xl p-4 bg-red-50" : "card-action"}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <Pill className="w-10 h-10 text-primary-blue" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{medication.name}</h3>
            <p className="text-slate-600">{medication.dosage} • {medication.frequency}</p>
          </div>
        </div>
        {isLowStock && (
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-bounce">
            <AlertTriangle className="w-6 h-6" />
            LOST STOCK ({medication.stock})
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleTake}
          className="btn-primary flex-1 py-6 text-2xl"
        >
          I Took It
        </button>
        <button
          onClick={() => {
            logMedication(medication.id, 'Skipped');
            speak("Medicine skipped.");
          }}
          className="bg-slate-200 text-slate-700 rounded-xl px-8"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
