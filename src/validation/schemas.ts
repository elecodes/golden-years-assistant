import { z } from 'zod';

export const frequencyEnum = z.enum(['Morning', 'Afternoon', 'Evening']);

export const medicationSchema = z.object({
  name: z.string()
    .min(1, 'Medication name is required')
    .max(100, 'Medication name is too long'),
  dosage: z.string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage is too long'),
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(9999, 'Stock is too high'),
  frequency: frequencyEnum,
  photo: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title is too long'),
  completed: z.boolean(),
});

export const medicationLogSchema = z.object({
  medId: z.string().uuid('Invalid medication ID'),
  status: z.enum(['Taken', 'Missed', 'Skipped']),
  timestamp: z.number()
    .int('Timestamp must be a whole number')
    .positive('Timestamp must be positive'),
});

export const shareCodeSchema = z.string()
  .length(6, 'Share code must be 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Share code must be uppercase alphanumeric');

export const waterGlassesSchema = z.number()
  .int('Water glasses must be a whole number')
  .min(0, 'Cannot have negative glasses')
  .max(8, 'Maximum 8 glasses per day');

export type MedicationInput = z.infer<typeof medicationSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type MedicationLogInput = z.infer<typeof medicationLogSchema>;
