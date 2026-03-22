import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { NotificationService } from '../services/notification.service';

/**
 * useNotificationScheduler
 * 
 * Hook that syncs medication store with scheduled notifications.
 * - Reacts to medication changes (add/remove)
 * - Cancels notifications when medications are removed
 * - Schedules notifications for new medications
 * 
 * Uses a ref to track previous state to detect changes.
 */
export function useNotificationScheduler() {
  const { medications, remindersEnabled } = useStore();
  const previousMedsRef = useRef<typeof medications>([]);

  useEffect(() => {
    // Skip if reminders feature is disabled
    if (!remindersEnabled) {
      // Cancel all scheduled notifications when disabled
      NotificationService.cancelAll();
      previousMedsRef.current = medications;
      return;
    }

    // Check if we have notification permission
    const permission = NotificationService.getPermissionStatus();
    if (permission !== 'granted') {
      console.warn('Notifications not permitted. Reminders will not work.');
      return;
    }

    // Detect removed medications
    const previousIds = new Set(previousMedsRef.current.map(m => m.id));
    const currentIds = new Set(medications.map(m => m.id));

    // Cancel notifications for removed medications
    previousIds.forEach(id => {
      if (!currentIds.has(id)) {
        NotificationService.cancelAllForMedication(id);
      }
    });

    // Detect medication changes and reschedule
    medications.forEach(medication => {
      const previousMed = previousMedsRef.current.find(m => m.id === medication.id);
      
      // New medication or scheduledTimes changed
      if (!previousMed) {
        // Schedule all times for new medication
        medication.scheduledTimes.forEach(time => {
          NotificationService.scheduleReminder(medication, time);
        });
      } else if (
        previousMed.scheduledTimes.join(',') !== medication.scheduledTimes.join(',')
      ) {
        // Times changed - reschedule
        NotificationService.cancelAllForMedication(medication.id);
        medication.scheduledTimes.forEach(time => {
          NotificationService.scheduleReminder(medication, time);
        });
      }
    });

    // Update ref
    previousMedsRef.current = medications;
  }, [medications, remindersEnabled]);

  // Request permission on mount
  useEffect(() => {
    if (remindersEnabled) {
      NotificationService.requestPermission();
    }
  }, [remindersEnabled]);

  return {
    permission: NotificationService.getPermissionStatus(),
    scheduledNotifications: NotificationService.getScheduledNotifications(),
  };
}

/**
 * useNotificationPermission
 * 
 * Hook to request and track notification permission status.
 */
export function useNotificationPermission() {
  const { remindersEnabled } = useStore();
  const permission = NotificationService.getPermissionStatus();

  const requestPermission = async () => {
    const result = await NotificationService.requestPermission();
    return result;
  };

  return {
    permission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isDefault: permission === 'default',
    requestPermission,
    remindersEnabled,
  };
}
