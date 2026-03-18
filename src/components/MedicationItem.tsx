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
      className={medication.stock === 0 ? "border border-red-300 rounded-xl p-4 bg-red-50/50" : "card"}
      aria-label={`${medication.name}, ${medication.dosage}, ${medication.frequency}, ${medication.stock} in stock`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="bg-sky-50 p-3 rounded-lg">
            <Pill className="w-7 h-7 text-cta" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{medication.name}</h3>
            <p className="text-sm text-slate-500">{medication.dosage} · {medication.frequency}</p>
          </div>
        </div>
        {isLowStock && (
          <div 
            className="badge badge-warning"
            role="alert"
            aria-live="polite"
          >
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <span>Low Stock ({medication.stock})</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleTake}
          className="btn-primary focus-ring flex-1 py-3 min-h-[60px] text-base"
          aria-label={`Take ${medication.name}. ${medication.stock > 0 ? `${medication.stock} pills remaining` : 'Out of stock'}`}
        >
          I Took It
        </button>
        <button
          onClick={() => {
            logMedication(medication.id, 'Skipped');
            speak("Medicine skipped.");
          }}
          className="focus-ring btn-secondary px-5 py-3 min-h-[60px] min-w-[80px] text-base"
          aria-label={`Skip taking ${medication.name}`}
        >
          Skip
        </button>
      </div>
    </article>
  );
};
