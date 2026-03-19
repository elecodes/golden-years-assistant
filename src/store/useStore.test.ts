import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      medications: [
        { id: 'm1', name: 'Test Med', dosage: '10mg', stock: 10, frequency: 'Morning' },
      ],
      logs: [],
      tasks: [
        { id: '1', title: 'Test Task', completed: false },
      ],
      waterGlasses: 0,
      lastDailySummary: null,
      shareCode: null,
    });
  });

  describe('medications', () => {
    it('should add a medication', () => {
      const initialCount = useStore.getState().medications.length;

      useStore.getState().addMedication({
        name: 'New Med',
        dosage: '20mg',
        stock: 5,
        frequency: 'Evening',
      });

      expect(useStore.getState().medications.length).toBe(initialCount + 1);
      expect(useStore.getState().medications[1].name).toBe('New Med');
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
          { id: 'm1', name: 'Med 1', dosage: '10mg', stock: 10, frequency: 'Morning' },
          { id: 'm2', name: 'Med 2', dosage: '20mg', stock: 20, frequency: 'Evening' },
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

    it('should log medication skipped', () => {
      useStore.getState().logMedication('m1', 'Skipped');

      expect(useStore.getState().logs[0].status).toBe('Skipped');
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
