import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  frequency: 'Morning' | 'Afternoon' | 'Evening';
  photo?: string; // Base64
}

export interface MedLog {
  id: string;
  medId: string;
  timestamp: number;
  status: 'Taken' | 'Missed' | 'Skipped';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface AppState {
  medications: Medication[];
  logs: MedLog[];
  tasks: Task[];
  waterGlasses: number;
  lastDailySummary: number | null;
  shareCode: string | null;

  // Actions
  addMedication: (med: Omit<Medication, 'id'>) => void;
  removeMedication: (id: string) => void;
  updateStock: (id: string, amount: number) => void;
  logMedication: (medId: string, status: MedLog['status']) => void;
  
  toggleTask: (id: string) => void;
  addGlass: () => void;
  resetGlasses: () => void;
  
  generateShareCode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      medications: [
        { id: 'm1', name: 'Blood Pressure Pill', dosage: '10mg', stock: 12, frequency: 'Morning' },
        { id: 'm2', name: 'Vitamin D', dosage: '2000 IU', stock: 45, frequency: 'Morning' },
        { id: 'm3', name: 'Pain Relief', dosage: '200mg', stock: 5, frequency: 'Evening' },
      ],
      logs: [],
      tasks: [
        { id: '1', title: 'Morning Medication', completed: false },
        { id: '2', title: 'Drink 8 Glasses of Water', completed: false },
        { id: '3', title: 'Daily Walk', completed: false },
        { id: '4', title: 'Stretching Exercises', completed: false },
      ],
      waterGlasses: 0,
      lastDailySummary: null,
      shareCode: null,

      addMedication: (med) => set((state) => ({
        medications: [...state.medications, { ...med, id: crypto.randomUUID() }]
      })),

      removeMedication: (id) => set((state) => ({
        medications: state.medications.filter((m) => m.id !== id)
      })),

      updateStock: (id, amount) => set((state) => ({
        medications: state.medications.map((m) => 
          m.id === id ? { ...m, stock: Math.max(0, m.stock + amount) } : m
        )
      })),

      logMedication: (medId, status) => set((state) => ({
        logs: [...state.logs, { id: crypto.randomUUID(), medId, status, timestamp: Date.now() }]
      })),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
      })),

      addGlass: () => set((state) => ({
        waterGlasses: Math.min(8, state.waterGlasses + 1)
      })),

      resetGlasses: () => set({
        waterGlasses: 0
      }),

      generateShareCode: () => set({
        shareCode: Math.random().toString(36).substring(2, 8).toUpperCase()
      }),
    }),
    {
      name: 'goldenyears-storage',
    }
  )
);
