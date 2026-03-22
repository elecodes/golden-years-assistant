const CACHE_NAME = 'goldenyears-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Medication reminder notification data
const REMINDER_CHANNEL = 'medication-reminders';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // Activate immediately
  (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients immediately
  event.waitUntil(
    (self as unknown as ServiceWorkerGlobalScope).clients.claim()
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Periodic background sync for medication reminders (every 15 minutes)
const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    const { medicationId, medicationName, dosage, time } = event.data;
    
    // Calculate delay until the scheduled time
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const delay = target.getTime() - now.getTime();
    
    // Set a timeout to show the notification
    setTimeout(() => {
      showMedicationNotification(medicationId, medicationName, dosage, time);
    }, delay);
  }
  
  // Handle cancel reminder messages
  if (event.data && event.data.type === 'CANCEL_REMINDER') {
    // In a more complex implementation, we'd track and clear timeouts
    // For now, the service worker can broadcast to all clients
    broadcastToClients({
      type: 'REMINDER_CANCELLED',
      medicationId: event.data.medicationId,
      time: event.data.time,
    });
  }
});

function showMedicationNotification(medicationId: string, name: string, dosage: string, time: string) {
  // Get all client windows
  (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(clients => {
    // If no window is open, show a notification
    if (clients.length === 0) {
      (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(
        'Time to take your medication',
        {
          body: `${name} - ${dosage}`,
          icon: '/icons.svg',
          badge: '/icons.svg',
          tag: `med-${medicationId}`,
          requireInteraction: true,
          vibrate: [200, 100, 200],
          data: {
            medicationId,
            time,
            name,
            dosage,
          },
          actions: [
            { action: 'take', title: 'Take' },
            { action: 'skip', title: 'Skip' },
          ],
        }
      );
    } else {
      // If window is open, send a message to it
      clients.forEach(client => {
        client.postMessage({
          type: 'MEDICATION_REMINDER',
          medicationId,
          name,
          dosage,
          time,
        });
      });
    }
  });
}

function broadcastToClients(message: object) {
  (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { medicationId, time } = event.notification.data || {};

  if (event.action === 'take') {
    // Handle take action - broadcast to app
    broadcastToClients({
      type: 'MEDICATION_TAKEN',
      medicationId,
      scheduledTime: time,
    });
  } else if (event.action === 'skip') {
    // Handle skip action - broadcast to app
    broadcastToClients({
      type: 'MEDICATION_SKIPPED',
      medicationId,
      scheduledTime: time,
    });
  } else {
    // Notification clicked (not action button) - open/focus app
    event.waitUntil(
      (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clientList => {
        // Try to focus an existing window
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        // If no window exists, open a new one
        if ((self as unknown as ServiceWorkerGlobalScope).clients.openWindow) {
          return (self as unknown as ServiceWorkerGlobalScope).clients.openWindow('/');
        }
      })
    );
  }
});

// Periodic Sync (if supported) - for checking reminders periodically
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'medication-check') {
    event.waitUntil(checkMedicationReminders());
  }
});

async function checkMedicationReminders() {
  // This would be called periodically to check if any reminders are due
  // In a real implementation, we'd read from IndexedDB to get scheduled times
  // For now, this is a placeholder that can be extended
  
  // Broadcast to all clients to let them check their local state
  broadcastToClients({
    type: 'CHECK_REMINDERS',
  });
}

// Background Sync (for logging medication when offline)
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'medication-log-sync') {
    event.waitUntil(syncMedicationLogs());
  }
});

async function syncMedicationLogs() {
  // In a real implementation, we'd sync any pending medication logs
  // to the server. For now, this is a placeholder.
  console.log('Syncing medication logs...');
}
