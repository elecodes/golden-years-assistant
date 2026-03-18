import { useState } from 'react';
import { ShieldCheck, Share2, Plus, Trash2, History as HistoryIcon, Camera } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Medication } from '../store/useStore';
import { speak } from '../utils/voice';
import { cn } from '../utils/cn';

export const CaregiverDashboard: React.FC = () => {
  const { medications, addMedication, removeMedication, logs, shareCode, generateShareCode } = useStore();
  const [newMed, setNewMed] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    stock: 30,
    frequency: 'Morning'
  });

  const handleAdd = () => {
    if (!newMed.name || !newMed.dosage) {
      speak("Please enter the name and dosage.");
      return;
    }
    addMedication(newMed);
    setNewMed({ name: '', dosage: '', stock: 30, frequency: 'Morning' });
    speak("Medication added successfully.");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <header className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 text-slate-800">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-2xl font-semibold tracking-tight">Caregiver Mode</h1>
        </div>
        <button
          onClick={generateShareCode}
          className="focus-ring btn-secondary flex items-center gap-2 px-4 py-3 min-h-[60px] w-full sm:w-auto"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-base font-medium">{shareCode ? `Code: ${shareCode}` : 'Share Access'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Adherence History */}
        <section className="col-span-full card">
           <div className="flex items-center gap-3 mb-4">
             <HistoryIcon className="w-5 h-5 text-slate-500" />
             <h2 className="text-lg font-semibold text-slate-700">Adherence History</h2>
           </div>
           <div className="max-h-48 overflow-y-auto flex flex-col gap-2">
              {logs.length > 0 ? (
                logs.slice().reverse().map(log => {
                  const med = medications.find(m => m.id === log.medId);
                  return (
                    <div key={log.id} className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-800">{med?.name || 'Unknown Medicine'}</span>
                        <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                      <span className={cn(
                        "text-sm font-medium px-3 py-1 rounded-full",
                        log.status === 'Taken' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {log.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400">No activity logged yet.</p>
              )}
           </div>
        </section>

        {/* Add Medication Form */}
        <section className="card flex flex-col gap-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
            <Plus className="w-5 h-5 text-cta" />
            Add Medication
          </h2>
          
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Medicine Name (e.g. Aspirin)"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="w-full"
            />
            <input
              type="text"
              placeholder="Dosage (e.g. 100mg)"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              className="w-full"
            />
            <div className="flex gap-3">
              <select 
                className="flex-1 p-3 text-base border-2 border-slate-200 rounded-lg focus:border-cta outline-none"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value as 'Morning' | 'Afternoon' | 'Evening' })}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
              <input
                type="number"
                placeholder="Stock"
                className="w-24"
                value={newMed.stock}
                onChange={(e) => setNewMed({ ...newMed, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <button className="focus-ring border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center gap-2 text-slate-400 hover:border-slate-400 transition-colors">
               <Camera className="w-6 h-6" />
               <span className="text-sm">Add Photo (Optional)</span>
            </button>

            <button
              onClick={handleAdd}
              className="btn-primary focus-ring py-4 min-h-[60px]"
            >
              Save Medication
            </button>
          </div>
        </section>

        {/* Existing Medications */}
        <section className="card flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-700">Current Medications</h2>
          <div className="flex flex-col gap-2">
            {medications.map(med => (
              <div key={med.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{med.name} ({med.dosage})</p>
                  <p className="text-xs text-slate-400">Stock: {med.stock}</p>
                </div>
                <button
                  onClick={() => removeMedication(med.id)}
                  className="focus-ring p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${med.name}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {medications.length === 0 && <p className="text-sm text-slate-400">No medications configured.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};
