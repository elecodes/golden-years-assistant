import { describe, it, expect } from 'vitest';
import { validate } from './index';
import { 
  medicationSchema, 
  taskSchema, 
  frequencyEnum, 
  timeStringSchema,
  reminderSchema,
  medicationFrequencyEnum,
} from './schemas';

describe('validation schemas', () => {
  describe('medicationSchema', () => {
    it('should validate a complete medication', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: ['08:00', '20:00'],
        notes: 'Take with food',
      });

      expect(result.success).toBe(true);
      expect(result.data!.name).toBe('Aspirin');
      expect(result.data!.scheduledTimes).toHaveLength(2);
    });

    it('should validate medication without optional notes', () => {
      const result = validate(medicationSchema, {
        name: 'Vitamin D',
        dosage: '2000 IU',
        stock: 60,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(true);
      expect(result.data!.notes).toBeUndefined();
    });

    it('should reject empty medication name', () => {
      const result = validate(medicationSchema, {
        name: '',
        dosage: '100mg',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('name: Medication name is required');
    });

    it('should reject medication name that is too long', () => {
      const result = validate(medicationSchema, {
        name: 'A'.repeat(101),
        dosage: '100mg',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('name: Medication name is too long');
    });

    it('should reject empty dosage', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('dosage: Dosage is required');
    });

    it('should reject negative stock', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: -5,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('stock: Stock cannot be negative');
    });

    it('should reject stock that is too high', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: 10000,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('stock: Stock is too high');
    });

    it('should reject invalid frequency', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: 30,
        frequency: 'INVALID',
        scheduledTimes: ['08:00'],
      });

      expect(result.success).toBe(false);
    });

    it('should accept all valid frequency values', () => {
      const validFrequencies = ['DAILY', 'TWICE_DAILY', 'WEEKLY', 'AS_NEEDED'];
      
      validFrequencies.forEach(freq => {
        const result = validate(medicationSchema, {
          name: 'Test Med',
          dosage: '10mg',
          stock: 10,
          frequency: freq,
          scheduledTimes: freq === 'AS_NEEDED' ? [] : ['08:00'],
        });
        
        if (freq !== 'AS_NEEDED') {
          expect(result.success).toBe(true);
        }
      });
    });

    it('should reject empty scheduledTimes array for non-AS_NEEDED', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: [],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('scheduledTimes: At least one scheduled time is required');
    });

    it('should accept empty scheduledTimes for AS_NEEDED', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: 30,
        frequency: 'AS_NEEDED',
        scheduledTimes: [],
      });

      expect(result.success).toBe(true);
    });

    it('should reject notes that are too long', () => {
      const result = validate(medicationSchema, {
        name: 'Aspirin',
        dosage: '100mg',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
        notes: 'A'.repeat(501),
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('notes: Notes must be 500 characters or less');
    });
  });

  describe('timeStringSchema', () => {
    it('should accept valid HH:MM format', () => {
      const validTimes = ['00:00', '08:00', '12:30', '23:59'];
      
      validTimes.forEach(time => {
        const result = validate(timeStringSchema, time);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid time formats', () => {
      const invalidTimes = ['8:00', '8am', '25:00', '8:60', 'abc', ''];
      
      invalidTimes.forEach(time => {
        const result = validate(timeStringSchema, time);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('frequencyEnum', () => {
    it('should accept valid frequencies', () => {
      expect(validate(frequencyEnum, 'DAILY').success).toBe(true);
      expect(validate(frequencyEnum, 'TWICE_DAILY').success).toBe(true);
      expect(validate(frequencyEnum, 'WEEKLY').success).toBe(true);
      expect(validate(frequencyEnum, 'AS_NEEDED').success).toBe(true);
    });

    it('should reject invalid frequencies', () => {
      expect(validate(frequencyEnum, 'Morning').success).toBe(false);
      expect(validate(frequencyEnum, 'INVALID').success).toBe(false);
      expect(validate(frequencyEnum, '').success).toBe(false);
    });
  });

  describe('medicationFrequencyEnum (including legacy)', () => {
    it('should accept legacy frequencies', () => {
      expect(validate(medicationFrequencyEnum, 'Morning').success).toBe(true);
      expect(validate(medicationFrequencyEnum, 'Afternoon').success).toBe(true);
      expect(validate(medicationFrequencyEnum, 'Evening').success).toBe(true);
    });

    it('should accept new frequencies', () => {
      expect(validate(medicationFrequencyEnum, 'DAILY').success).toBe(true);
      expect(validate(medicationFrequencyEnum, 'TWICE_DAILY').success).toBe(true);
    });
  });

  describe('reminderSchema', () => {
    it('should validate a valid reminder', () => {
      const result = validate(reminderSchema, {
        medId: 'med-123',
        time: '08:00',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid time in reminder', () => {
      const result = validate(reminderSchema, {
        medId: 'med-123',
        time: '8:00', // Invalid format
      });

      expect(result.success).toBe(false);
    });
  });

  describe('taskSchema', () => {
    it('should validate a valid task', () => {
      const result = validate(taskSchema, {
        title: 'Take morning medication',
        completed: false,
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty task title', () => {
      const result = validate(taskSchema, {
        title: '',
        completed: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('title: Task title is required');
    });

    it('should reject task title that is too long', () => {
      const result = validate(taskSchema, {
        title: 'A'.repeat(201),
        completed: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('title: Task title is too long');
    });
  });
});
