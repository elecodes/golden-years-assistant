import { z } from 'zod';

// New frequency enum for medication reminders
export const frequencyEnum = z.enum(['DAILY', 'TWICE_DAILY', 'WEEKLY', 'AS_NEEDED']);

// Legacy frequency enum (for migration)
export const legacyFrequencyEnum = z.enum(['Morning', 'Afternoon', 'Evening']);

// Combined frequency enum for backward compatibility
export const medicationFrequencyEnum = z.enum(['DAILY', 'TWICE_DAILY', 'WEEKLY', 'AS_NEEDED', 'Morning', 'Afternoon', 'Evening']);

// Time format validation (HH:MM)
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export const timeStringSchema = z.string().regex(timeRegex, 'Time must be in HH:MM format (e.g., 08:00, 14:30)');

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
  frequency: medicationFrequencyEnum,
  scheduledTimes: z.array(timeStringSchema),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
  photo: z.string().optional(),
}).superRefine((data, ctx) => {
  // Custom validation for scheduledTimes based on frequency
  if (data.frequency !== 'AS_NEEDED' && data.scheduledTimes.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1,
      type: 'array',
      origin: 'array',
      message: 'At least one scheduled time is required',
      path: ['scheduledTimes'],
    });
  }
});

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title is too long'),
  completed: z.boolean(),
});

export const medicationLogSchema = z.object({
  medId: z.string(),
  status: z.enum(['Taken', 'Missed', 'Skipped']),
  timestamp: z.number()
    .int('Timestamp must be a whole number')
    .positive('Timestamp must be positive'),
  scheduledTime: timeStringSchema.optional(),
});

export const shareCodeSchema = z.string()
  .length(6, 'Share code must be 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Share code must be uppercase alphanumeric');

export const waterGlassesSchema = z.number()
  .int('Water glasses must be a whole number')
  .min(0, 'Cannot have negative glasses')
  .max(8, 'Maximum 8 glasses per day');

// Reminder-specific schema for scheduling
export const reminderSchema = z.object({
  medId: z.string(),
  time: timeStringSchema,
});

export type MedicationInput = z.infer<typeof medicationSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type MedicationLogInput = z.infer<typeof medicationLogSchema>;
export type Frequency = z.infer<typeof frequencyEnum>;
