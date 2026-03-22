# ADR-012: Medication Reminders

## Status
Accepted

## Context
Need to enable elderly users to receive timely push notifications for medication reminders. This addresses medication adherence - a core healthcare need for elderly patients managing multiple prescriptions.

## Decision
Implement a comprehensive medication reminder system using:
- **Web Notifications API** with Service Worker for background delivery
- **Zustand store extension** for medication data model
- **Feature flag** for gradual rollout (VITE_REMINDERS_ENABLED)

## Technical Approach

### Notification Strategy
- Use Web Notifications API (browser-native, no server required)
- Service Worker for background notification delivery
- Fallback to in-app reminder banner when permissions denied

### Data Model Extension
```typescript
interface Medication {
  scheduledTimes: string[];  // ['08:00', '20:00']
  notes?: string;
  createdAt: number;
}
```

### Frequency Options
- DAILY (once daily)
- TWICE_DAILY (morning + evening)
- WEEKLY
- AS_NEEDED

## Consequences

### Positive
- No server/cloud infrastructure required
- Native browser notifications work when PWA is installed
- Seamless integration with existing Zustand store

### Negative
- Notifications only work when browser is open/has PWA installed
- Safari has more restrictive notification support

### Limitations
- Background delivery depends on Service Worker lifecycle
- Timezone handling not implemented (user travels)

## Related Files
- src/store/useStore.ts
- src/services/notification.service.ts
- src/pages/RemindersDashboard.tsx
- src/pages/AddMedication.tsx
- src/pages/MedicationHistory.tsx
- src/components/ReminderCard.tsx
- src/hooks/useNotificationScheduler.ts
- public/sw.js
- src/config/reminders.ts