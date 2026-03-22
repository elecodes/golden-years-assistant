import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Frequency = 'DAILY' | 'TWICE_DAILY' | 'WEEKLY' | 'AS_NEEDED';
export type LegacyFrequency = 'Morning' | 'Afternoon' | 'Evening';
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type MedicationFrequency = Frequency | LegacyFrequency;

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  frequency: MedicationFrequency;
  scheduledTimes: string[]; // HH:MM format, e.g., ['08:00', '20:00']
  notes?: string; // max 500 chars
  createdAt: number; // timestamp
  photo?: string; // Base64
}

export interface MedLog {
  id: string;
  medId: string;
  timestamp: number;
  status: 'Taken' | 'Missed' | 'Skipped';
  scheduledTime?: string; // which scheduled time this log refers to (HH:MM)
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
  remindersEnabled: boolean; // feature flag

  // Actions
  addMedication: (med: Omit<Medication, 'id' | 'createdAt'>) => void;
  removeMedication: (id: string) => void;
  updateStock: (id: string, amount: number) => void;
  logMedication: (medId: string, status: MedLog['status'], scheduledTime?: string) => void;
  
  toggleTask: (id: string) => void;
  addGlass: () => void;
  resetGlasses: () => void;
  
  generateShareCode: () => void;
  migrateLegacyMedications: () => void;
  setRemindersEnabled: (enabled: boolean) => void;
}

// Legacy frequency mapping for migration
const LEGACY_TO_SCHEDULED_TIMES: Record<LegacyFrequency, string[]> = {
  Morning: ['08:00'],
  Afternoon: ['14:00'],
  Evening: ['20:00'],
};

const LEGACY_FREQUENCY_MAP: Record<LegacyFrequency, Frequency> = {
  Morning: 'DAILY',
  Afternoon: 'DAILY',
  Evening: 'DAILY',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      medications: [
        { 
          id: 'm1', 
          name: 'Blood Pressure Pill', 
          dosage: '10mg', 
          stock: 12, 
          frequency: 'DAILY',
          scheduledTimes: ['08:00'],
          notes: 'Take with food',
          createdAt: Date.now(),
        },
        { 
          id: 'm2', 
          name: 'Vitamin D', 
          dosage: '2000 IU', 
          stock: 45, 
          frequency: 'DAILY',
          scheduledTimes: ['08:00'],
          createdAt: Date.now(),
        },
        { 
          id: 'm3', 
          name: 'Pain Relief', 
          dosage: '200mg', 
          stock: 5, 
          frequency: 'DAILY',
          scheduledTimes: ['20:00'],
          createdAt: Date.now(),
        },
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
      remindersEnabled: false, // disabled by default (feature flag)

      addMedication: (med) => set((state) => ({
        medications: [...state.medications, { 
          ...med, 
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          // Ensure defaults for legacy data
          scheduledTimes: med.scheduledTimes ?? [],
          notes: med.notes ?? undefined,
        }]
      })),

      removeMedication: (id) => set((state) => ({
        medications: state.medications.filter((m) => m.id !== id)
      })),

      updateStock: (id, amount) => set((state) => ({
        medications: state.medications.map((m) => 
          m.id === id ? { ...m, stock: Math.max(0, m.stock + amount) } : m
        )
      })),

      logMedication: (medId, status, scheduledTime) => set((state) => ({
        logs: [...state.logs, { 
          id: crypto.randomUUID(), 
          medId, 
          status, 
          timestamp: Date.now(),
          scheduledTime, 
        }]
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

      migrateLegacyMedications: () => set((state) => ({
        medications: state.medications.map((med) => {
          // Only migrate if still using legacy frequency
          if ('Morning' === med.frequency || 'Afternoon' === med.frequency || 'Evening' === med.frequency) {
            const legacyFreq = med.frequency as LegacyFrequency;
            return {
              ...med,
              frequency: LEGACY_FREQUENCY_MAP[legacyFreq],
              scheduledTimes: med.scheduledTimes.length > 0 
                ? med.scheduledTimes 
                : LEGACY_TO_SCHEDULED_TIMES[legacyFreq],
              notes: med.notes ?? undefined,
              createdAt: med.createdAt ?? Date.now(),
            };
          }
          return med;
        })
      })),

      setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),
    }),
    {
      name: 'goldenyears-storage',
    }
  )
);
