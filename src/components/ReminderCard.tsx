import React from 'react';
import { CheckCircle2, Circle, SkipForward } from 'lucide-react';
import type { Medication } from '../store/useStore';
import { useStore } from '../store/useStore';
import { speak } from '../utils/voice';
import { cn } from '../utils/cn';

interface ReminderCardProps {
  medication: Medication;
  scheduledTime: string;
  status?: 'pending' | 'taken' | 'skipped';
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ 
  medication, 
  scheduledTime, 
  status = 'pending' 
}) => {
  const { updateStock, logMedication } = useStore();

  const handleTake = () => {
    if (medication.stock > 0) {
      updateStock(medication.id, -1);
      logMedication(medication.id, 'Taken', scheduledTime);
      speak(`Medicine taken. You have ${medication.stock - 1} pills left.`);
      
      if (medication.stock - 1 < 7) {
        speak("Warning: You are running low on this medicine.");
      }
    } else {
      speak("You are out of this medicine. Please call for a refill.");
    }
  };

  const handleSkip = () => {
    logMedication(medication.id, 'Skipped', scheduledTime);
    speak("Medicine skipped.");
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const isLowStock = medication.stock < 7;
  const isOutOfStock = medication.stock === 0;

  return (
    <article 
      className={cn(
        "rounded-2xl p-5 transition-all duration-200",
        status === 'taken' && "bg-emerald-50/50 border-2 border-emerald-200",
        status === 'skipped' && "bg-amber-50/50 border-2 border-amber-200",
        status === 'pending' && "bg-white border border-slate-200 shadow-sm",
        isOutOfStock && "border-2 border-red-200 bg-red-50/30"
      )}
      aria-label={`${medication.name}, ${medication.dosage}, scheduled for ${formatTime(scheduledTime)}, status: ${status}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          {/* Status Icon */}
          {status === 'taken' ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" aria-hidden="true" />
          ) : status === 'skipped' ? (
            <SkipForward className="w-8 h-8 text-amber-500 flex-shrink-0" aria-hidden="true" />
          ) : (
            <Circle className="w-8 h-8 text-slate-300 flex-shrink-0" aria-hidden="true" />
          )}
          
          <div>
            <h3 
              className="text-xl font-semibold text-slate-800"
              style={{ fontSize: '18px' }}
            >
              {medication.name}
            </h3>
            <p 
              className="text-base text-slate-600"
              style={{ fontSize: '16px' }}
            >
              {medication.dosage}
            </p>
            <p 
              className="text-lg font-medium text-cta mt-1"
              style={{ fontSize: '18px' }}
            >
              {formatTime(scheduledTime)}
            </p>
          </div>
        </div>

        {/* Stock Warning */}
        {isLowStock && status === 'pending' && (
          <div 
            className="badge badge-warning text-sm"
            style={{ fontSize: '14px' }}
            role="alert"
            aria-live="polite"
          >
            Low Stock ({medication.stock})
          </div>
        )}

        {/* Status Badge */}
        {status !== 'pending' && (
          <div 
            className={cn(
              "badge text-sm",
              status === 'taken' && "badge-success",
              status === 'skipped' && "bg-amber-100 text-amber-800"
            )}
            style={{ fontSize: '14px' }}
          >
            {status === 'taken' ? 'Taken' : 'Skipped'}
          </div>
        )}
      </div>

      {/* Notes (if any) */}
      {medication.notes && (
        <p 
          className="text-sm text-slate-500 mb-4 italic"
          style={{ fontSize: '16px' }}
        >
          {medication.notes}
        </p>
      )}

      {/* Action Buttons */}
      {status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={handleTake}
            disabled={isOutOfStock}
            className={cn(
              "flex-1 py-4 rounded-xl font-semibold transition-all duration-200 min-h-[60px]",
              "focus-ring flex items-center justify-center gap-2",
              isOutOfStock
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "btn-primary"
            )}
            style={{ fontSize: '18px' }}
            aria-label={`Take ${medication.name}. ${isOutOfStock ? 'Out of stock' : `${medication.stock} pills remaining`}`}
          >
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            Take
          </button>
          <button
            onClick={handleSkip}
            className={cn(
              "px-6 py-4 rounded-xl font-semibold transition-all duration-200 min-h-[60px] min-w-[100px]",
              "focus-ring flex items-center justify-center gap-2",
              "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
            style={{ fontSize: '18px' }}
            aria-label={`Skip taking ${medication.name}`}
          >
            <SkipForward className="w-6 h-6" aria-hidden="true" />
            Skip
          </button>
        </div>
      )}
    </article>
  );
};
