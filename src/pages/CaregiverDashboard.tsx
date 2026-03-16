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
      <header className="py-8 flex justify-between items-center">
        <div className="flex items-center gap-3 text-blue-800">
          <ShieldCheck className="w-10 h-10" />
          <h1 className="text-4xl font-black">Caregiver Mode</h1>
        </div>
        <button
          onClick={generateShareCode}
          className="bg-slate-800 text-white rounded-xl px-6 py-4 flex items-center gap-3"
        >
          <Share2 className="w-6 h-6" />
          <span className="text-xl font-bold">{shareCode ? `Code: ${shareCode}` : 'Share Access'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Adherence History */}
        <section className="col-span-full bg-slate-50 p-6 rounded-3xl border-2 border-slate-200">
           <div className="flex items-center gap-3 mb-6">
             <HistoryIcon className="w-8 h-8 text-slate-700" />
             <h2 className="text-2xl font-bold text-slate-800">Adherence History</h2>
           </div>
           <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
              {logs.length > 0 ? (
                logs.slice().reverse().map(log => {
                  const med = medications.find(m => m.id === log.medId);
                  return (
                    <div key={log.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                      <div>
                        <span className="font-bold text-lg">{med?.name || 'Unknown Medicine'}</span>
                        <p className="text-sm text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                      <span className={cn(
                        "font-bold px-4 py-1 rounded-full",
                        log.status === 'Taken' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {log.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500">No activity logged yet.</p>
              )}
           </div>
        </section>

        {/* Add Medication Form */}
        <section className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Plus className="w-8 h-8 text-blue-600" />
            Add Medication
          </h2>
          
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Medicine Name (e.g. Aspirin)"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dosage (e.g. 100mg)"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
            />
            <div className="flex gap-4">
              <select 
                className="flex-1 min-h-[60px] p-4 text-xl border-2 rounded-lg"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value as any })}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
              <input
                type="number"
                placeholder="Initial Stock"
                className="w-32"
                value={newMed.stock}
                onChange={(e) => setNewMed({ ...newMed, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <button className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center gap-2 text-slate-500">
               <Camera className="w-10 h-10" />
               <span>Add Photo (Optional)</span>
            </button>

            <button
              onClick={handleAdd}
              className="btn-primary py-6 text-2xl mt-4"
            >
              Save Medication
            </button>
          </div>
        </section>

        {/* Existing Medications */}
        <section className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Current Medications</h2>
          <div className="flex flex-col gap-3">
            {medications.map(med => (
              <div key={med.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-xl">{med.name} ({med.dosage})</p>
                  <p className="text-sm text-slate-500">Stock: {med.stock}</p>
                </div>
                <button
                  onClick={() => removeMedication(med.id)}
                  className="bg-red-50 text-red-600 p-3 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            ))}
            {medications.length === 0 && <p className="text-slate-500 italic">No medications configured.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};
