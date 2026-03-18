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
    <article 
      className={medication.stock === 0 ? "border-red-500 border-4 rounded-2xl p-4 bg-red-50" : "card-action"}
      aria-label={`${medication.name}, ${medication.dosage}, ${medication.frequency}, ${medication.stock} in stock`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <Pill className="w-10 h-10 text-primary-blue" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{medication.name}</h3>
            <p className="text-slate-600 text-xl">{medication.dosage} • {medication.frequency}</p>
          </div>
        </div>
        {isLowStock && (
          <div 
            className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-bounce"
            role="alert"
            aria-live="polite"
          >
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            <span>LOW STOCK ({medication.stock})</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleTake}
          className="btn-primary focus-ring flex-1 py-6 text-2xl min-h-[70px]"
          aria-label={`Take ${medication.name}. ${medication.stock > 0 ? `${medication.stock} pills remaining` : 'Out of stock'}`}
        >
          I Took It
        </button>
        <button
          onClick={() => {
            logMedication(medication.id, 'Skipped');
            speak("Medicine skipped.");
          }}
          className="focus-ring bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl px-8 py-6 min-h-[70px] min-w-[100px] transition-colors duration-200"
          aria-label={`Skip taking ${medication.name}`}
        >
          Skip
        </button>
      </div>
    </article>
  );
};
