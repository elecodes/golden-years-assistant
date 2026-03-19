import { describe, it, expect } from 'vitest';
import { validate, safeValidate } from './index';
import { medicationSchema, taskSchema, frequencyEnum } from './schemas';

describe('validation utilities', () => {
  describe('validate', () => {
    it('should return success for valid data', () => {
      const result = validate(medicationSchema, {
        name: 'Test Med',
        dosage: '10mg',
        stock: 30,
        frequency: 'Morning',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should return errors for invalid data', () => {
      const result = validate(medicationSchema, {
        name: '',
        dosage: '',
        stock: -5,
        frequency: 'Invalid',
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should validate medication name is required', () => {
      const result = validate(medicationSchema, {
        name: '',
        dosage: '10mg',
        stock: 10,
        frequency: 'Morning',
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('name: Medication name is required');
    });

    it('should validate stock is non-negative', () => {
      const result = validate(medicationSchema, {
        name: 'Test',
        dosage: '10mg',
        stock: -1,
        frequency: 'Morning',
      });

      expect(result.success).toBe(false);
      expect(result.errors && result.errors.length > 0).toBe(true);
    });
  });

  describe('safeValidate', () => {
    it('should return typed data on success', () => {
      const result = safeValidate(taskSchema, {
        title: 'Test Task',
        completed: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Task');
        expect(result.data.completed).toBe(false);
      }
    });

    it('should return errors on failure without throwing', () => {
      const result = safeValidate(taskSchema, {
        title: '',
        completed: 'not a boolean' as unknown as boolean,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
      }
    });
  });

  describe('frequencyEnum', () => {
    it('should accept valid frequencies', () => {
      expect(validate(frequencyEnum, 'Morning').success).toBe(true);
      expect(validate(frequencyEnum, 'Afternoon').success).toBe(true);
      expect(validate(frequencyEnum, 'Evening').success).toBe(true);
    });

    it('should reject invalid frequencies', () => {
      expect(validate(frequencyEnum, 'Night').success).toBe(false);
      expect(validate(frequencyEnum, '').success).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should properly narrow success case', () => {
      const result = safeValidate(taskSchema, {
        title: 'Test',
        completed: false,
      });

      if (result.success) {
        expect(typeof result.data.title).toBe('string');
      } else {
        expect(result.errors).toBeDefined();
      }
    });
  });
});
