import React, { useMemo } from 'react';
import { Bell, Pill } from 'lucide-react';
import { useStore, type Medication } from '../store/useStore';
import { ReminderCard } from '../components/ReminderCard';

interface TimeGroup {
  label: string;
  timeRange: string;
  icon: string;
  minHour: number;
  maxHour: number;
  items: Array<{
    medication: Medication;
    scheduledTime: string;
    status: 'pending' | 'taken' | 'skipped';
  }>;
}

const TIME_GROUPS = [
  { label: 'Morning', timeRange: '5:00 AM - 12:00 PM', icon: '🌅', minHour: 5, maxHour: 11 },
  { label: 'Afternoon', timeRange: '12:00 PM - 5:00 PM', icon: '☀️', minHour: 12, maxHour: 16 },
  { label: 'Evening', timeRange: '5:00 PM - 9:00 PM', icon: '🌆', minHour: 17, maxHour: 20 },
  { label: 'Night', timeRange: '9:00 PM - 5:00 AM', icon: '🌙', minHour: 21, maxHour: 4 },
];

interface RemindersDashboardProps {
  onNavigate?: (view: 'dashboard' | 'reminders' | 'add-medication' | 'history') => void;
}

export const RemindersDashboard: React.FC<RemindersDashboardProps> = ({ onNavigate }) => {
  const { medications, logs } = useStore();
  
  const handleAddMedication = () => {
    onNavigate?.('add-medication');
  };

  // Group medications by time of day and check their status
  const groupedReminders = useMemo(() => {
    const groups: TimeGroup[] = TIME_GROUPS.map(group => ({
      ...group,
      items: [],
    }));

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    // Get today's logs
    const todayLogs = (logs || []).filter(
      log => log.timestamp >= startOfDay && log.timestamp < endOfDay
    );

    medications?.forEach(medication => {
      const times = medication.scheduledTimes || [];
      times.forEach(time => {
        const [hours] = time.split(':').map(Number);
        
        // Find the appropriate group
        const group = groups.find(g => {
          if (g.label === 'Night') {
            return hours >= g.minHour || hours <= g.maxHour;
          }
          return hours >= g.minHour && hours <= g.maxHour;
        });

        if (group) {
          // Check if there's a log for this medication and time today
          const relevantLog = todayLogs.find(
            log => log.medId === medication.id && log.scheduledTime === time
          );

          let status: 'pending' | 'taken' | 'skipped' = 'pending';
          if (relevantLog) {
            status = relevantLog.status === 'Taken' ? 'taken' : 'skipped';
          }

          group.items.push({
            medication,
            scheduledTime: time,
            status,
          });
        }
      });
    });

    // Sort items within each group by time
    groups.forEach(group => {
      group.items.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    });

    return groups;
  }, [medications, logs]);

  const hasAnyMedications = medications.length > 0;
  const totalItems = groupedReminders.reduce((sum, g) => sum + g.items.length, 0);
  const completedCount = groupedReminders.reduce(
    (sum, g) => sum + g.items.filter(i => i.status !== 'pending').length, 
    0
  );

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="py-8 px-4">
        <div className="flex items-center gap-3 text-slate-800 mb-2">
          <Bell className="w-9 h-9" />
          <h1 className="text-3xl font-semibold tracking-tight">Today's Reminders</h1>
        </div>
        {hasAnyMedications && (
          <p className="text-lg text-slate-500">
            {totalItems > 0 
              ? `${completedCount} of ${totalItems} reminders completed`
              : 'No reminders scheduled for today'
            }
          </p>
        )}
      </header>

      {!hasAnyMedications ? (
        /* Empty State */
        <div className="px-4">
          <div className="card text-center py-16">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill className="w-10 h-10 text-slate-400" aria-hidden="true" />
            </div>
            <h2 
              className="text-2xl font-semibold text-slate-700 mb-3"
              style={{ fontSize: '22px' }}
            >
              No medications scheduled
            </h2>
            <p 
              className="text-lg text-slate-500 mb-8 max-w-md mx-auto"
              style={{ fontSize: '18px' }}
            >
              Add your first medication to start receiving reminders
            </p>
            <button 
              className="btn-primary focus-ring px-8 py-4 min-h-[60px] mx-auto"
              style={{ fontSize: '18px' }}
              onClick={handleAddMedication}
            >
              Add Medication
            </button>
          </div>
        </div>
      ) : (
        /* Time Grouped Reminders */
        <div className="px-4 space-y-8">
          {groupedReminders.map(group => {
            if (group.items.length === 0) return null;

            return (
              <section key={group.label} aria-labelledby={`group-${group.label}`} aria-label={group.label}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {group.icon}
                  </span>
                  <div>
                    <h2 
                      id={`group-${group.label}`}
                      className="text-xl font-semibold text-slate-700"
                      style={{ fontSize: '20px' }}
                    >
                      {group.label}
                    </h2>
                    <p className="text-sm text-slate-400">{group.timeRange}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-sm text-slate-500">
                      {group.items.filter(i => i.status !== 'pending').length}/{group.items.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {group.items.map((item, index) => (
                    <ReminderCard
                      key={`${item.medication.id}-${item.scheduledTime}-${index}`}
                      medication={item.medication}
                      scheduledTime={item.scheduledTime}
                      status={item.status}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
