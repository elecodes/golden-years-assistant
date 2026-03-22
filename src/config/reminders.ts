/**
 * Medication Reminders Feature Configuration
 * 
 * This file contains configuration for the medication reminders feature.
 * The feature flag controls whether reminders are enabled.
 */

// Feature flag - controlled by environment variable
export const REMINDERS_ENABLED = 
  import.meta.env.VITE_REMINDERS_ENABLED === 'true' || false;

// Notification configuration
export const NOTIFICATION_CONFIG = {
  // Default reminder times (used when adding new medications)
  defaultTimes: {
    morning: '08:00',
    afternoon: '14:00',
    evening: '20:00',
    night: '22:00',
  },
  
  // Time periods for grouping reminders
  timeGroups: {
    morning: { minHour: 5, maxHour: 11, label: 'Morning' },
    afternoon: { minHour: 12, maxHour: 16, label: 'Afternoon' },
    evening: { minHour: 17, maxHour: 20, label: 'Evening' },
    night: { minHour: 21, maxHour: 4, label: 'Night' },
  },
  
  // Sync interval for checking reminders (in milliseconds)
  syncInterval: 15 * 60 * 1000, // 15 minutes
  
  // History retention (in days)
  historyRetentionDays: 7,
};

/**
 * Initialize reminders feature
 * 
 * This function should be called on app startup to:
 * 1. Check if reminders are enabled
 * 2. Request notification permissions if enabled
 * 3. Run migrations if needed
 */
export async function initializeReminders(): Promise<void> {
  const { useStore } = await import('../store/useStore');
  const { NotificationService } = await import('../services/notification.service');
  
  // Check if we should enable reminders based on env var
  if (REMINDERS_ENABLED && !useStore.getState().remindersEnabled) {
    // Request notification permission
    const permission = await NotificationService.requestPermission();
    
    if (permission === 'granted') {
      useStore.getState().setRemindersEnabled(true);
    }
  }
}

/**
 * Migration utilities
 */
export const MIGRATION_CONFIG = {
  // Version of the data schema
  dataVersion: 2,
  
  // Legacy frequency to new enum mapping
  legacyFrequencyMap: {
    Morning: { frequency: 'DAILY', scheduledTimes: ['08:00'] },
    Afternoon: { frequency: 'DAILY', scheduledTimes: ['14:00'] },
    Evening: { frequency: 'DAILY', scheduledTimes: ['20:00'] },
  },
};
