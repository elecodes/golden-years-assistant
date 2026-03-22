import type { Medication } from '../store/useStore';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface ScheduledNotification {
  medicationId: string;
  time: string;
  timeoutId?: ReturnType<typeof setTimeout>;
}

/**
 * NotificationService - Web Notifications API wrapper
 * 
 * Handles notification permission requests, scheduling, and display
 * for medication reminders using the Web Notifications API.
 */
class NotificationServiceImpl {
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  /**
   * Check current notification permission status
   */
  private async checkPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      this.permission = 'denied';
      return this.permission;
    }
    
    this.permission = Notification.permission as NotificationPermission;
    return this.permission;
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      this.permission = 'denied';
      return this.permission;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result as NotificationPermission;
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      this.permission = 'denied';
      return this.permission;
    }
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  /**
   * Generate a unique key for a scheduled notification
   */
  private getNotificationKey(medicationId: string, time: string): string {
    return `${medicationId}:${time}`;
  }

  /**
   * Calculate milliseconds until the next occurrence of a time
   */
  private getMillisecondsUntil(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    
    target.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    return target.getTime() - now.getTime();
  }

  /**
   * Schedule a notification for a medication at a specific time
   */
  scheduleReminder(medication: Medication, time: string): void {
    const key = this.getNotificationKey(medication.id, time);
    
    // Cancel existing notification for this key if any
    this.cancelReminder(medication.id, time);

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted, skipping schedule');
      return;
    }

    const msUntil = this.getMillisecondsUntil(time);
    
    const timeoutId = setTimeout(() => {
      this.showNotification(medication, time);
      
      // Reschedule for the next day (for DAILY/TWICE_DAILY)
      if (medication.frequency === 'DAILY' || medication.frequency === 'TWICE_DAILY') {
        this.scheduleDaily(medication, time);
      }
    }, msUntil);

    this.scheduledNotifications.set(key, {
      medicationId: medication.id,
      time,
      timeoutId,
    });
  }

  /**
   * Schedule a daily recurring notification
   */
  private scheduleDaily(medication: Medication, time: string): void {
    const key = this.getNotificationKey(medication.id, time);
    
    // 24 hours in milliseconds
    const DAY_MS = 24 * 60 * 60 * 1000;
    
    const timeoutId = setTimeout(() => {
      this.showNotification(medication, time);
      this.scheduleDaily(medication, time);
    }, DAY_MS);

    this.scheduledNotifications.set(key, {
      medicationId: medication.id,
      time,
      timeoutId,
    });
  }

  /**
   * Cancel a specific scheduled notification
   */
  cancelReminder(medicationId: string, time: string): void {
    const key = this.getNotificationKey(medicationId, time);
    const scheduled = this.scheduledNotifications.get(key);
    
    if (scheduled?.timeoutId) {
      clearTimeout(scheduled.timeoutId);
    }
    
    this.scheduledNotifications.delete(key);
  }

  /**
   * Cancel all scheduled notifications for a medication
   */
  cancelAllForMedication(medicationId: string): void {
    const keysToDelete: string[] = [];
    
    this.scheduledNotifications.forEach((value, key) => {
      if (value.medicationId === medicationId) {
        if (value.timeoutId) {
          clearTimeout(value.timeoutId);
        }
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.scheduledNotifications.delete(key));
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAll(): void {
    this.scheduledNotifications.forEach(scheduled => {
      if (scheduled.timeoutId) {
        clearTimeout(scheduled.timeoutId);
      }
    });
    this.scheduledNotifications.clear();
  }

  /**
   * Show a notification for a medication
   */
  private showNotification(medication: Medication, time: string): void {
    if (this.permission !== 'granted') {
      return;
    }

    const notification = new Notification('Time to take your medication', {
      body: `${medication.name} - ${medication.dosage}`,
      icon: '/icons.svg',
      tag: `med-${medication.id}-${time}`,
      requireInteraction: true,
      badge: '/icons.svg',
      data: {
        medicationId: medication.id,
        time,
      },
    } as NotificationOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  /**
   * Show a test notification (for debugging)
   */
  async showTestNotification(title: string, body: string): Promise<void> {
    const currentPermission = await this.checkPermission();
    
    if (currentPermission !== 'granted') {
      console.warn('Cannot show test notification: permission not granted');
      return;
    }

    new Notification(title, {
      body,
      icon: '/icons.svg',
    });
  }

  /**
   * Get all currently scheduled notifications
   */
  getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }
}

// Singleton instance
export const NotificationService = new NotificationServiceImpl();
