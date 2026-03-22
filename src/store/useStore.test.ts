import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      medications: [
        { id: 'm1', name: 'Test Med', dosage: '10mg', stock: 10, frequency: 'DAILY', scheduledTimes: ['08:00'], createdAt: Date.now() },
      ],
      logs: [],
      tasks: [
        { id: '1', title: 'Test Task', completed: false },
      ],
      waterGlasses: 0,
      lastDailySummary: null,
      shareCode: null,
      remindersEnabled: false,
    });
  });

  describe('medications', () => {
    it('should add a medication with new fields', () => {
      const initialCount = useStore.getState().medications.length;

      useStore.getState().addMedication({
        name: 'New Med',
        dosage: '20mg',
        stock: 5,
        frequency: 'TWICE_DAILY',
        scheduledTimes: ['08:00', '20:00'],
        notes: 'Take with food',
      });

      expect(useStore.getState().medications.length).toBe(initialCount + 1);
      expect(useStore.getState().medications[1].name).toBe('New Med');
      expect(useStore.getState().medications[1].scheduledTimes).toEqual(['08:00', '20:00']);
      expect(useStore.getState().medications[1].notes).toBe('Take with food');
      expect(useStore.getState().medications[1].createdAt).toBeDefined();
    });

    it('should add a medication without optional fields', () => {
      useStore.getState().addMedication({
        name: 'Simple Med',
        dosage: '50mg',
        stock: 10,
        frequency: 'DAILY',
        scheduledTimes: ['09:00'],
      });

      const added = useStore.getState().medications.find(m => m.name === 'Simple Med');
      expect(added?.notes).toBeUndefined();
    });

    it('should remove a medication', () => {
      const initialCount = useStore.getState().medications.length;

      useStore.getState().removeMedication('m1');

      expect(useStore.getState().medications.length).toBe(initialCount - 1);
    });

    it('should update stock', () => {
      useStore.getState().updateStock('m1', -2);

      expect(useStore.getState().medications[0].stock).toBe(8);
    });

    it('should not allow stock to go below 0', () => {
      useStore.getState().updateStock('m1', -100);

      expect(useStore.getState().medications[0].stock).toBeGreaterThanOrEqual(0);
    });

    it('should only update stock for matching medication id', () => {
      useStore.setState({
        medications: [
          { id: 'm1', name: 'Med 1', dosage: '10mg', stock: 10, frequency: 'DAILY', scheduledTimes: ['08:00'], createdAt: Date.now() },
          { id: 'm2', name: 'Med 2', dosage: '20mg', stock: 20, frequency: 'DAILY', scheduledTimes: ['20:00'], createdAt: Date.now() },
        ],
      });

      useStore.getState().updateStock('m1', -5);

      expect(useStore.getState().medications[0].stock).toBe(5);
      expect(useStore.getState().medications[1].stock).toBe(20);
    });
  });

  describe('medication logging', () => {
    it('should log medication taken', () => {
      useStore.getState().logMedication('m1', 'Taken');

      expect(useStore.getState().logs.length).toBe(1);
      expect(useStore.getState().logs[0].status).toBe('Taken');
    });

    it('should log medication taken with scheduled time', () => {
      useStore.getState().logMedication('m1', 'Taken', '08:00');

      expect(useStore.getState().logs[0].scheduledTime).toBe('08:00');
    });

    it('should log medication skipped', () => {
      useStore.getState().logMedication('m1', 'Skipped');

      expect(useStore.getState().logs[0].status).toBe('Skipped');
    });
  });

  describe('reminder scheduling', () => {
    it('should enable reminders', () => {
      expect(useStore.getState().remindersEnabled).toBe(false);

      useStore.getState().setRemindersEnabled(true);

      expect(useStore.getState().remindersEnabled).toBe(true);
    });

    it('should migrate legacy medications', () => {
      // Set up with legacy medication (no scheduledTimes - simulates legacy data)
      useStore.setState({
        medications: [
          { id: 'legacy1', name: 'Legacy Med', dosage: '5mg', stock: 20, frequency: 'Morning', scheduledTimes: [], createdAt: Date.now() },
        ],
      });

      // Migrate
      useStore.getState().migrateLegacyMedications();

      const migrated = useStore.getState().medications[0];
      expect(migrated.frequency).toBe('DAILY');
      expect(migrated.scheduledTimes).toEqual(['08:00']);
    });

    it('should preserve existing scheduledTimes during migration', () => {
      // Set up with legacy medication that has scheduledTimes
      useStore.setState({
        medications: [
          { id: 'legacy1', name: 'Legacy Med', dosage: '5mg', stock: 20, frequency: 'Morning', scheduledTimes: ['09:30'], createdAt: Date.now() },
        ],
      });

      // Migrate
      useStore.getState().migrateLegacyMedications();

      const migrated = useStore.getState().medications[0];
      expect(migrated.frequency).toBe('DAILY');
      expect(migrated.scheduledTimes).toEqual(['09:30']); // Preserved
    });
  });

  describe('tasks', () => {
    it('should toggle task completion', () => {
      expect(useStore.getState().tasks[0].completed).toBe(false);

      useStore.getState().toggleTask('1');

      expect(useStore.getState().tasks[0].completed).toBe(true);
    });

    it('should only toggle matching task', () => {
      useStore.setState({
        tasks: [
          { id: '1', title: 'Task 1', completed: false },
          { id: '2', title: 'Task 2', completed: false },
        ],
      });

      useStore.getState().toggleTask('1');

      expect(useStore.getState().tasks[0].completed).toBe(true);
      expect(useStore.getState().tasks[1].completed).toBe(false);
    });
  });

  describe('hydration', () => {
    it('should add a glass of water', () => {
      expect(useStore.getState().waterGlasses).toBe(0);

      useStore.getState().addGlass();

      expect(useStore.getState().waterGlasses).toBe(1);
    });

    it('should not exceed 8 glasses', () => {
      useStore.setState({ waterGlasses: 8 });

      useStore.getState().addGlass();

      expect(useStore.getState().waterGlasses).toBe(8);
    });

    it('should reset glasses', () => {
      useStore.setState({ waterGlasses: 5 });

      useStore.getState().resetGlasses();

      expect(useStore.getState().waterGlasses).toBe(0);
    });
  });

  describe('share code', () => {
    it('should generate a share code', () => {
      expect(useStore.getState().shareCode).toBeNull();

      useStore.getState().generateShareCode();

      expect(useStore.getState().shareCode).not.toBeNull();
      expect(useStore.getState().shareCode?.length).toBe(6);
    });
  });
});
