import React from 'react';
import { LayoutGrid, Volume2, CheckCircle2, Circle, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { speak } from '../utils/voice';
import { HydrationTracker } from '../components/HydrationTracker';
import { MedicationItem } from '../components/MedicationItem';
import { cn } from '../utils/cn';

interface DashboardProps {
  onNavigate?: (view: 'dashboard' | 'reminders' | 'add-medication' | 'history') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { tasks, toggleTask, medications, waterGlasses } = useStore();

  const handleVoiceSummary = () => {
    const pendingTasks = tasks.filter(t => !t.completed);
    const lowStockMeds = medications.filter(m => m.stock < 7);
    
    let summary = "Good morning! Here is your summary for today. ";
    
    if (pendingTasks.length > 0) {
      summary += `You have ${pendingTasks.length} tasks remaining: ${pendingTasks.map(t => t.title).join(", ")}. `;
    } else {
      summary += "You have completed all your tasks. Great job! ";
    }

    if (waterGlasses < 8) {
      summary += `Remember to drink ${8 - waterGlasses} more glasses of water. `;
    }

    if (lowStockMeds.length > 0) {
      summary += `Warning: You are low on ${lowStockMeds.map(m => m.name).join(", ")}. Please arrange a refill soon.`;
    }

    speak(summary, 0.75);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
        <div className="flex items-center gap-3 text-slate-800">
          <LayoutGrid className="w-9 h-9" />
          <h1 className="text-3xl font-semibold tracking-tight">Daily Overview</h1>
        </div>
        <button
          onClick={handleVoiceSummary}
          className="focus-ring btn-success flex items-center gap-3 px-5 py-3 min-h-[60px] w-full sm:w-auto"
        >
          <Volume2 className="w-6 h-6" aria-hidden="true" />
          <span className="text-lg font-medium">Read Summary</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Today's Progress Section */}
        <section className="col-span-full">
           <div className="card">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-slate-700">Today's Progress</h2>
                <span className="text-2xl font-semibold text-slate-800" role="status" aria-live="polite">
                  {tasks.filter(t => t.completed).length}/{tasks.length}
                </span>
              </div>
              <div 
                className="w-full bg-slate-100 rounded-full h-3 overflow-hidden"
                role="progressbar"
                aria-valuenow={tasks.filter(t => t.completed).length}
                aria-valuemin={0}
                aria-valuemax={tasks.length}
                aria-label="Task completion progress"
              >
                <div 
                  className="bg-cta h-full transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                />
              </div>
           </div>
        </section>

        {/* Tasks List */}
        <section className="flex flex-col gap-3" aria-label="Daily Tasks">
          <h2 className="text-xl font-semibold text-slate-700">Tasks</h2>
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => {
                toggleTask(task.id);
                speak(task.completed ? `Unchecked ${task.title}` : `Completed ${task.title}`);
              }}
              className={cn(
                "card-interactive flex items-center gap-4 text-left min-h-[72px]",
                task.completed && "bg-emerald-50/50 border-emerald-200"
              )}
              aria-pressed={task.completed}
            >
              {task.completed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="w-8 h-8 text-slate-300 flex-shrink-0" aria-hidden="true" />
              )}
              <span className={cn("text-lg font-medium", task.completed && "line-through text-slate-500")}>
                {task.title}
              </span>
            </button>
          ))}
        </section>

        {/* Hydration Tracker */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Hydration</h2>
          <HydrationTracker />
        </section>

        {/* Medication Tracker */}
        <section className="col-span-full" aria-label="Medication Tracker">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-slate-700">Medications</h2>
            {onNavigate && (
              <button
                onClick={() => onNavigate('reminders')}
                className="flex items-center gap-2 text-cta hover:text-sky-700 transition-colors text-base font-medium min-h-[48px]"
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
                View Reminders
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.length > 0 ? (
              medications.map(med => (
                <MedicationItem key={med.id} medication={med} />
              ))
            ) : (
              <div className="col-span-full card text-center py-10">
                <p className="text-slate-500 mb-6">No medications added yet.</p>
                <button 
                   className="btn-primary focus-ring px-6 py-3 min-h-[60px]"
                   onClick={() => onNavigate ? onNavigate('add-medication') : speak("To add a medication, please ask your caregiver to help you in the settings.")}
                >
                  Add Medicine
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
