import React from 'react';
import { LayoutGrid, Volume2, CheckCircle2, Circle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { speak } from '../utils/voice';
import { HydrationTracker } from '../components/HydrationTracker';
import { MedicationItem } from '../components/MedicationItem';
import { cn } from '../utils/cn';

export const Dashboard: React.FC = () => {
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
        <div className="flex items-center gap-3 text-primary-blue">
          <LayoutGrid className="w-10 h-10" />
          <h1 className="text-4xl font-black">Daily Overview</h1>
        </div>
        <button
          onClick={handleVoiceSummary}
          className="focus-ring bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg active:scale-95 transition-all duration-200 w-full sm:w-auto"
        >
          <Volume2 className="w-8 h-8" aria-hidden="true" />
          <span className="text-xl font-bold">Read Daily Summary</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Today's Progress Section */}
        <section className="col-span-full">
           <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary-blue">Today's Progress</h2>
                <span className="text-3xl font-black text-primary-blue" role="status" aria-live="polite">
                  {tasks.filter(t => t.completed).length}/{tasks.length}
                </span>
              </div>
              <div 
                className="w-full bg-blue-100 rounded-full h-8 overflow-hidden"
                role="progressbar"
                aria-valuenow={tasks.filter(t => t.completed).length}
                aria-valuemin={0}
                aria-valuemax={tasks.length}
                aria-label="Task completion progress"
              >
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                  style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                />
              </div>
           </div>
        </section>

        {/* Tasks List */}
        <section className="flex flex-col gap-4" aria-label="Daily Tasks">
          <h2 className="text-3xl font-bold mb-2">Today's Tasks</h2>
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => {
                toggleTask(task.id);
                speak(task.completed ? `Unchecked ${task.title}` : `Completed ${task.title}`);
              }}
              className={cn(
                "card-action flex items-center gap-6 text-left min-h-[80px]",
                task.completed && "bg-green-50 border-green-200"
              )}
              aria-pressed={task.completed}
            >
              {task.completed ? (
                <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="w-10 h-10 text-slate-300 flex-shrink-0" aria-hidden="true" />
              )}
              <span className={cn("text-2xl font-bold", task.completed && "line-through text-slate-500")}>
                {task.title}
              </span>
            </button>
          ))}
        </section>

        {/* Hydration Tracker */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Hydration</h2>
          <HydrationTracker />
        </section>

        {/* Medication Tracker */}
        <section className="col-span-full" aria-label="Medication Tracker">
          <h2 className="text-3xl font-bold mb-4">Medication Tracker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medications.length > 0 ? (
              medications.map(med => (
                <MedicationItem key={med.id} medication={med} />
              ))
            ) : (
              <div className="col-span-full p-12 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl">
                <p className="text-2xl text-slate-600 mb-6">No medications added yet.</p>
                <button 
                   className="btn-primary focus-ring px-8 py-4 min-h-[60px]"
                   onClick={() => speak("To add a medication, please ask your caregiver to help you in the settings.")}
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
